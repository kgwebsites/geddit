import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element/lit-element.js?module";
import "../elements/post/post.element.js";
import "../elements/button.element.js";

class Subreddit extends LitElement {
  static get properties() {
    return {
      posts: Array,
      after: String,
      loading: Boolean,
      context: { type: Object, reflect: true },
    };
  }

  static get styles() {
    return css`
      .mb {
        margin-bottom: 8px;
      }
      .post-container {
        width: 100%;
      }
      .flex-center {
        display: flex;
        justify-content: center;
      }
    `;
  }

  constructor() {
    super();
    this.posts = [];
    this.after = "";
    this.loading = false;

    this.getAndSetPosts = this.getAndSetPosts.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadContext();
    this.loadInitialData();
  }

  loadContext() {
    try {
      const context = document.querySelector("#view-context").text;
      this.context = JSON.parse(context);
    } catch (e) {
      console.error(e.message);
    }
  }

  loadInitialData() {
    try {
      const dataElement = document.querySelector("#data");
      const data = dataElement.text;
      if (data) {
        this.posts = JSON.parse(JSON.parse(data)).data.children;
        this.after = this.posts[this.posts.length - 1].data.name;

        // clear initial data after parsing
        dataElement.text = "";
      } else this.getAndSetPosts();
    } catch (e) {
      console.error(e.message);
      this.getAndSetPosts();
    }
  }

  async getAndSetPosts() {
    this.loading = true;
    try {
      const res = await fetch(
        `https://api.reddit.com/r/${this.context.params?.subreddit}?after=${this.after}`
      );
      const json = await res.json();
      this.posts = [...this.posts, ...json.data.children];
      this.after = json.data.after;
    } catch (e) {
      console.error(e.message);
    }
    this.loading = false;
  }

  render() {
    if (this.posts.length)
      return html`<div class="posts">
          ${this.posts.map(
            (post) => html`<div class="mb post-container">
              <geddit-element-post post="${JSON.stringify(post)}" />
            </div>`
          )}
        </div>
        <div class="flex-center">
          <geddit-button
            .disabled="${this.loading}"
            .onClick="${(e) => this.getAndSetPosts(e)}"
            >Load More</geddit-button
          >
        </div>`;
  }
}

customElements.define("geddit-view-subreddit", Subreddit);

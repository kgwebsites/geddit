import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element/lit-element.js?module";
import "../elements/post/post.element.js";
import "../elements/button.element.js";

class Home extends LitElement {
  static get properties() {
    return {
      posts: Array,
      after: String,
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
    this.getAndSetPosts = this.getAndSetPosts.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadInitialData();
  }

  loadInitialData() {
    try {
      const data = document.querySelector("#data").text;
      this.posts = JSON.parse(JSON.parse(data)).data.children;
      this.after = this.posts[this.posts.length - 1].data.name;
    } catch (e) {
      console.error(e.message);
      this.getAndSetPosts();
    }
  }

  async getAndSetPosts() {
    try {
      const res = await fetch(
        `https://api.reddit.com/r/popular?after=${this.after}`
      );
      const json = await res.json();
      this.posts = [...this.posts, ...json.data.children];
      this.after = json.data.after;
    } catch (e) {
      console.error(e.message);
    }
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
          <geddit-button .onClick="${(e) => this.getAndSetPosts(e)}"
            >Load More</geddit-button
          >
        </div>`;
  }
}

customElements.define("geddit-view-home", Home);

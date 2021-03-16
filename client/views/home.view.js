import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element/lit-element.js?module";
import "../elements/post.element.js";

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
    `;
  }

  constructor() {
    super();
    this.posts = [];
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadInitialData();
  }

  loadInitialData() {
    try {
      const data = document.querySelector("#data").text;
      this.posts = JSON.parse(JSON.parse(data)).data.children;
    } catch (e) {
      console.error(e.message);
      this.getAndSetPosts();
    }
  }

  async getAndSetPosts() {
    try {
      const res = await fetch("https://api.reddit.com/r/popular");
      const json = await res.json();
      this.posts = json.data.children;
      this.after = json.data.after;
    } catch (e) {
      console.error(e.message);
    }
  }

  render() {
    return html`<div>
      ${this.posts.map(
        (post) =>
          html`<div class="mb">
            <geddit-element-post post="${JSON.stringify(post)}" />
          </div>`
      )}
    </div> `;
  }
}

customElements.define("geddit-view-home", Home);

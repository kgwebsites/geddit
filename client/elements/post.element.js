import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element/lit-element.js?module";
import "./defaultIcon.element.js";
import { timeAgo } from "../utils/date.js";
import { htmlDecode } from "../utils/url.js";

class Post extends LitElement {
  static get properties() {
    return {
      post: { type: Object, reflect: true },
      subreddit: { type: Object },
    };
  }

  static get styles() {
    return css`
      .post {
        padding: 8px;
        background: white;
        border-radius: 3px;
      }
      .post-header {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
      }
      .subreddit_icon {
        width: 24px;
        height: 24px;
        border-radius: 50%;
      }
      .preview {
        display: flex;
        justify-content: center;
      }
      .preview img {
        max-height: 300px;
        max-width: 100%;
      }
      .mx {
        margin-left: 8px;
        margin-right: 8px;
      }
      .mr {
        margin-right: 8px;
      }
    `;
  }

  constructor() {
    super();
    this.post = {};
    this.subreddit = null;
  }

  firstUpdated() {
    if (this.post.data?.subreddit_name_prefixed) {
      const { subreddit_name_prefixed } = this.post.data;
      let localStorageSubreddit = localStorage.getItem(subreddit_name_prefixed);

      if (localStorageSubreddit) {
        try {
          localStorageSubreddit = JSON.parse(localStorageSubreddit);
        } catch (e) {
          console.error(
            "Local subreddit data corrupted and cleared from system"
          );
          localStorage.removeItem(subreddit_name_prefixed);
          this.getAndSetSubreddit(subreddit_name_prefixed);
        }
        this.subreddit = localStorageSubreddit;
      } else {
        this.getAndSetSubreddit(subreddit_name_prefixed);
      }
    }
  }

  async getAndSetSubreddit(subreddit_name_prefixed) {
    try {
      const res = await fetch(`/${subreddit_name_prefixed}`);
      const { data } = await res.json();
      this.subreddit = data;
      localStorage.setItem(subreddit_name_prefixed, JSON.stringify(data));
    } catch (e) {
      console.error("Error retrieving subreddit information", e.message);
      this.subreddit = {};
    }
  }

  renderPreview() {
    switch (this.post.data.post_hint) {
      case "image":
        return html`<img src="${this.post.data.url}" />`;
      default:
        return null;
    }
  }

  render() {
    if (this.post.data)
      return html`
        <div class="post">
          <div class="post-header">
            ${this.subreddit &&
            (this.subreddit.community_icon || this.subreddit.icon_img)
              ? html`<img
                  src="${htmlDecode(
                    this.subreddit.community_icon || this.subreddit.icon_img
                  )}"
                  alt="${this.subreddit.display_name}"
                  class="subreddit_icon"
                />`
              : html`<geddit-default-icon></geddit-default-icon>`}
            <strong class="mx"
              >${this.post.data.subreddit_name_prefixed}</strong
            >
            <span class="mr"> • </span>
            <span>${timeAgo(this.post?.data?.created) || ""}</span>
          </div>
          <div><a href="/post">${this.post.data.title}</a></div>
          ${this.post.data.url?.startsWith("http")
            ? html`<div class="preview">${this.renderPreview()}</div>`
            : null}
        </div>
      `;
  }
}

customElements.define("geddit-element-post", Post);

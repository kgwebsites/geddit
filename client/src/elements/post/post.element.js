import { LitElement, html, css } from "lit-element";
import page from "page";
import "../defaultIcon.element.js";
import "./post-karma.element.js";
import "./post-awards.element.js";
import { timeAgo } from "../../utils/date.js";
import { htmlDecode } from "../../utils/url.js";
import { abbreviate } from "../../utils/numbers.js";

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
        background: var(--foreground);
        border-radius: 3px;
      }
      .post-header {
        display: flex;
        align-items: center;
      }
      .post-subreddit {
        color: var(--blue-400);
        font-weight: bold;
        text-decoration: none;
      }
      .post-body {
        display: flex;
        flex-direction: column;
        background: transparent;
        border: 0;
        padding: 0;
      }
      .post-title {
        color: var(--font-color);
        text-decoration: none;
      }
      .post-footer {
        display: flex;
        align-items: center;
      }
      geddit-element-post-awards {
        overflow-x: scroll;
      }
      .post-comments {
        display: flex;
        border: 1px solid;
        border-radius: 16px;
        padding: 8px;
      }
      .post-comments svg {
        width: 16px;
        height: 16px;
        margin-right: 8px;
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
      .preview img,
      .preview video {
        max-height: 300px;
        max-width: 100%;
        margin-top: 8px;
      }
      .mx {
        margin-left: 8px;
        margin-right: 8px;
      }
      .mr {
        margin-right: 8px;
      }
      .mb {
        margin-bottom: 8px;
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
      const res = await fetch(`/about/${subreddit_name_prefixed}`);
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
      case "hosted:video":
        return html`<video controls>
          <source
            src="${this.post.data.media.reddit_video.fallback_url}"
            type="video/mp4"
          />
        </video>`;
      default:
        return null;
    }
  }

  goToPost() {
    page(`/post/${this.post.data.id}`);
  }

  render() {
    return html`
      <div class="post">
        <div class="post-header mb">
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
          <a
            href="/${this.post.data.subreddit_name_prefixed}"
            class="mx post-subreddit"
            >${this.post.data.subreddit_name_prefixed}</a
          >
          <span class="mr"> • </span>
          <span>${timeAgo(this.post?.data?.created) || ""}</span>
        </div>
        <button class="post-body mb" @click="${this.goToPost}">
          <a class="post-title" href="/post">${this.post.data.title}</a>
          ${this.post.data.url?.startsWith("http")
            ? html`<div class="preview">${this.renderPreview()}</div>`
            : null}
        </button>
        <div class="post-footer">
          <geddit-element-post-karma
            .score="${this.post.data.score}"
          ></geddit-element-post-karma>
          <geddit-element-post-awards
            class="mx"
            .awards="${this.post.data.all_awardings}"
          ></geddit-element-post-awards>
          <div class="post-comments">
            <svg
              class="PostFooter__comments-icon-new"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clip-rule="evenodd"
                d="M4.00001 0C2.99219 0 2.02564 0.400356 1.31301 1.11299C0.600368 1.82563 0.200012 2.79218 0.200012 3.8V8.6C0.200012 9.60782 0.600368 10.5744 1.31301 11.287C2.02564 11.9996 2.99219 12.4 4.00001 12.4H5.35149L7.5753 14.6238C7.57545 14.624 7.5756 14.6241 7.57575 14.6243C7.81006 14.8586 8.18996 14.8586 8.42428 14.6243L10.6485 12.4H12C13.0078 12.4 13.9744 11.9996 14.687 11.287C15.3997 10.5744 15.8 9.60782 15.8 8.6V3.8C15.8 2.79218 15.3997 1.82563 14.687 1.11299C13.9744 0.400356 13.0078 0 12 0H4.00001ZM8.00001 13.3515L9.97575 11.3757C10.0883 11.2632 10.2409 11.2 10.4 11.2H12C12.6896 11.2 13.3509 10.9261 13.8385 10.4385C14.3261 9.95088 14.6 9.28956 14.6 8.6V3.8C14.6 3.11044 14.3261 2.44912 13.8385 1.96152C13.3509 1.47393 12.6896 1.2 12 1.2H4.00001C3.31045 1.2 2.64913 1.47393 2.16153 1.96152C1.67394 2.44912 1.40001 3.11044 1.40001 3.8V8.6C1.40001 9.28956 1.67394 9.95088 2.16153 10.4385C2.64913 10.9261 3.31045 11.2 4.00001 11.2H5.60001C5.7657 11.2 5.91569 11.2672 6.02427 11.3757C6.02435 11.3758 6.02443 11.3759 6.02452 11.376L8.00001 13.3515Z"
                fill="currentColor"
                fill-rule="evenodd"
              ></path>
            </svg>
            <div>${abbreviate(this.post.data.num_comments)}</div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("geddit-element-post", Post);

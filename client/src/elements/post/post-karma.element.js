import { LitElement, html, css } from "lit-element";
import "../defaultIcon.element.js";
import { abbreviate } from "../../utils/numbers.js";

class PostKarma extends LitElement {
  static get properties() {
    return {
      score: { type: Number, reflect: true },
    };
  }

  static get styles() {
    return css`
      .post-karma {
        display: inline-flex;
        align-items: center;
        font-size: 12px;
        border: 1px solid;
        border-radius: 16px;
      }
      .post-karma-voting-box {
        height: 32px;
        width: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .post-karma svg {
        color: var(--font-color);
        width: 16px;
        height: 16px;
      }
    `;
  }

  render() {
    return html`
      <div class="post-karma">
        <div class="post-karma-voting-box">
          <svg
            height="16"
            viewBox="0 0 16 16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              d="m8 .200001c.17143 0 .33468.073332.44854.201491l7.19996 8.103998c.157.17662.1956.42887.0988.64437-.0968.21551-.3111.35414-.5473.35414h-3.4v5.496c0 .3314-.2686.6-.6.6h-6.4c-.33137 0-.6-.2686-.6-.6v-5.496h-3.4c-.236249 0-.450507-.13863-.547314-.35414-.096807-.2155-.058141-.46775.09877-.64437l7.200004-8.103998c.11386-.128159.27711-.201491.44854-.201491zm-5.86433 8.103999h2.66433c.33137 0 .6.26863.6.6v5.496h5.2v-5.496c0-.33137.2686-.6.6-.6h2.6643l-5.8643-6.60063"
              fill="currentColor"
              fill-rule="evenodd"
            ></path>
          </svg>
        </div>
        <div class="post-karma-value">
          ${this.score > 0 ? abbreviate(this.score) : "Vote"}
        </div>
        <div class="post-karma-voting-box">
          <svg
            height="16"
            viewBox="0 0 16 16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              d="M4.2 0.799997C4.2 0.468626 4.46863 0.199997 4.8 0.199997H11.2C11.5314 0.199997 11.8 0.468626 11.8 0.799997V6.304H15.2C15.4363 6.304 15.6506 6.44269 15.7474 6.65827C15.8441 6.87385 15.8054 7.12615 15.6483 7.30273L8.44835 15.3987C8.33449 15.5268 8.17133 15.6 8 15.6C7.82867 15.6 7.66551 15.5268 7.55165 15.3987L0.351652 7.30273C0.194618 7.12615 0.15585 6.87385 0.252626 6.65827C0.349402 6.44269 0.563698 6.304 0.8 6.304H4.2V0.799997ZM5.4 1.4V6.904C5.4 7.23537 5.13137 7.504 4.8 7.504H2.13654L8 14.0971L13.8635 7.504H11.2C10.8686 7.504 10.6 7.23537 10.6 6.904V1.4H5.4Z"
              fill="currentColor"
              fill-rule="evenodd"
            ></path>
          </svg>
        </div>
      </div>
    `;
  }
}

customElements.define("geddit-element-post-karma", PostKarma);

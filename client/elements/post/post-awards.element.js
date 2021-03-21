import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element/lit-element.js?module";
import { abbreviate } from "../../utils/numbers.js";
import { htmlDecode } from "../../utils/url.js";

class PostAwards extends LitElement {
  static get properties() {
    return {
      awards: { type: Array, reflect: true },
      awardsCountToShow: Number,
    };
  }

  static get styles() {
    return css`
      .post-awards {
        overflow-x: scroll;
        border: 1px solid;
        border-radius: 16px;
        padding: 8px;
      }
      .post-awards-container {
        display: flex;
      }
      .post-awards-see-all {
        background: none;
        color: var(--font-color);
        border: none;
      }
    `;
  }

  constructor() {
    super();
    this.awardsCountToShow = 3;
  }

  showAllAwards(e) {
    e.stopPropagation();
    this.awardsCountToShow = this.awards.length;
  }

  truncateAwards() {
    this.awardsCountToShow = 3;
  }

  render() {
    const awards = this.awards.slice(0, this.awardsCountToShow);
    return html`
      <div class="post-awards" @click="${this.truncateAwards}">
        <div class="post-awards-container">
          ${awards.length
            ? html`
                ${awards.map(
                  (award) => html`
                    <img
                      src="${htmlDecode(award.resized_icons[0].url)}"
                      width="${award.resized_icons[0].width}px"
                      height="${award.resized_icons[0].height}px"
                      alt="${award.helpful}"
                    />
                  `
                )}
                ${this.awards.length > 3 && this.awardsCountToShow === 3
                  ? html`
                      <button
                        class="post-awards-see-all"
                        @click="${this.showAllAwards}"
                      >
                        ${this.awards.length}
                      </button>
                    `
                  : ""}
              `
            : html`
                <svg
                  class="post-awards-none"
                  height="16"
                  viewBox="0 0 16 16"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.00001 4.20001C8.33138 4.20001 8.60001 4.46864 8.60001 4.80001V7.40001H11.2C11.5314 7.40001 11.8 7.66863 11.8 8.00001C11.8 8.33138 11.5314 8.60001 11.2 8.60001H8.60001V11.2C8.60001 11.5314 8.33138 11.8 8.00001 11.8C7.66864 11.8 7.40001 11.5314 7.40001 11.2V8.60001H4.80001C4.46864 8.60001 4.20001 8.33138 4.20001 8.00001C4.20001 7.66863 4.46864 7.40001 4.80001 7.40001H7.40001V4.80001C7.40001 4.46864 7.66864 4.20001 8.00001 4.20001Z"
                    fill="currentColor"
                  ></path>
                  <path
                    clip-rule="evenodd"
                    d="M8.00001 0.197662C7.51154 0.197662 7.03701 0.360229 6.65119 0.659651L1.12676 4.82489L1.12009 4.83007C0.735744 5.12843 0.451895 5.53724 0.306658 6.00162C0.161479 6.46581 0.161927 6.96385 0.307603 7.42788L2.41007 14.167C2.54958 14.634 2.83463 15.0444 3.22372 15.3381C3.61402 15.6328 4.08847 15.7947 4.57749 15.8L11.408 15.8001L11.4145 15.8C11.9036 15.7947 12.378 15.6328 12.7683 15.3381C13.1573 15.0444 13.4423 14.6342 13.5819 14.1673L15.6924 7.42781C15.8383 6.96365 15.8386 6.46598 15.6934 6.00162C15.5481 5.53724 15.2643 5.12838 14.88 4.83002L9.34885 0.659662C8.96303 0.360232 8.48849 0.197662 8.00001 0.197662ZM7.38501 1.60914C7.56072 1.47209 7.77718 1.39766 8.00001 1.39766C8.22285 1.39766 8.43925 1.47215 8.61496 1.6092L14.1471 5.7803C14.3364 5.92828 14.4763 6.1304 14.5481 6.35982C14.6202 6.59045 14.6199 6.83817 14.5474 7.06871L12.4354 13.8127L12.4328 13.8214C12.3667 14.0444 12.2308 14.2403 12.0452 14.3804C11.8604 14.52 11.6359 14.5969 11.4044 14.6H4.58765C4.35613 14.5969 4.13161 14.52 3.94678 14.3804C3.76118 14.2403 3.62542 14.0444 3.55931 13.8214L1.45278 7.06932L1.45242 7.06816C1.37998 6.83763 1.37982 6.59045 1.45195 6.35982C1.5237 6.13039 1.66358 5.92827 1.85295 5.7803L7.37728 1.61517L7.38501 1.60914Z"
                    fill="currentColor"
                    fill-rule="evenodd"
                  ></path>
                </svg>
              `}
        </div>
      </div>
    `;
  }
}

customElements.define("geddit-element-post-awards", PostAwards);

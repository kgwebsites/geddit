import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element/lit-element.js?module";

class Button extends LitElement {
  static get properties() {
    return {
      class: { type: String, reflect: true },
      onClick: { type: Function, reflect: true },
      onFocus: { type: Function, reflect: true },
    };
  }

  static get styles() {
    return css`
      button {
        color: var(--blue-400);
        background: transparent;
        border: 1px solid var(--blue-400);
        padding: 4px 8px;
        font-size: 14px;
        border-radius: 3px;
      }
    `;
  }

  constructor() {
    super();
    this.class = "";
    this.onClick = () => {};
    this.onFocus = () => {};
  }

  render() {
    return html`<button
      class="geddit-button ${this.class}"
      @click="${this.onClick}"
      @focus="${this.onFocus}"
    >
      <slot></slot>
    </button>`;
  }
}

customElements.define("geddit-button", Button);

import { LitElement, html, css } from "lit-element";

class Button extends LitElement {
  static get properties() {
    return {
      class: { type: String, reflect: true },
      onClick: { type: Function, reflect: true },
      onFocus: { type: Function, reflect: true },
      disabled: { type: Boolean, reflect: true },
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
      button:disabled {
        color: var(--grey-100);
        border-color: var(--grey-100);
      }
    `;
  }

  constructor() {
    super();
    this.class = "";
    this.onClick = () => {};
    this.onFocus = () => {};
    this.disabled = false;
  }

  render() {
    return html`<button
      class="geddit-button ${this.class}"
      ?disabled=${this.disabled}
      @click="${this.onClick}"
      @focus="${this.onFocus}"
    >
      <slot></slot>
    </button>`;
  }
}

customElements.define("geddit-button", Button);

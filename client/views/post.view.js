import {
  LitElement,
  html,
} from "https://unpkg.com/lit-element/lit-element.js?module";

class Post extends LitElement {
  render() {
    return html`<div>Hello from Post!</div> `;
  }
}

customElements.define("geddit-view-post", Post);

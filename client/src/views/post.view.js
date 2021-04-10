import { LitElement, html } from "lit-element";

class Post extends LitElement {
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

  render() {
    return html`<div>Hello from Post!</div> `;
  }
}

customElements.define("geddit-view-post", Post);

export default Post;

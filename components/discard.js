import { html, render } from 'lit-html/lit-html.js';

export class Discard extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		render(this.template(), this);
	}

	disconnectedCallback() {
		this.unsubscribe();
	}

  template = () =>
		html`
      ${this.style()}
      <h1>Discard</h1>
		`;

  style () {
    return html`
      <style>
      </style>
    `;
  }
}

if (!customElements.get('c-discard')) {
	customElements.define('c-discard', Discard);
}
import { html, render } from 'lit-html/lit-html.js';

export class Deck extends HTMLElement {
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
      <h1>Deck</h1>
		`;

  style () {
    return html`
      <style>
      </style>
    `;
  }
}

if (!customElements.get('c-deck')) {
	customElements.define('c-deck', Deck);
}
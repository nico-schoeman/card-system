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
      <div>Deck</div>
		`;

  style () {
    return html`
      <style>
        c-deck div {
					width: var(--card-width);
					height: var(--card-height);
					cursor: pointer;
					user-select: none;
          background: gray;
					border: 2px solid black;
				}
      </style>
    `;
  }
}

if (!customElements.get('c-deck')) {
	customElements.define('c-deck', Deck);
}
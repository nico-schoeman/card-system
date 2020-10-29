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
      <div>Discard</div>
		`;

  style () {
    return html`
      <style>
        c-discard div {
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

if (!customElements.get('c-discard')) {
	customElements.define('c-discard', Discard);
}
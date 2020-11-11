//TODO: choice select, use for discover card, select reward, select starting character?
import { html, render } from 'lit-html/lit-html.js';

export class Choice extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		render(this.template(), this);
	}

	disconnectedCallback() {
	}

  template = () =>
		html`
      ${this.style()}
      <div>choice</div>
		`;
//TODO: choice display
  style () {
    return html`
      <style>
        c-choice {
          position: absolute;
        }
      </style>
    `;
  }
}

if (!customElements.get('c-choice')) {
	customElements.define('c-choice', Choice);
}
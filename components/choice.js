import { html, render } from 'lit-html/lit-html.js';
import { repeat } from 'lit-html/directives/repeat.js';

export class Choice extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		render(this.template(), this);
    console.log('render');
	}

	disconnectedCallback() {
	}

  template = () =>
		html`
      ${this.style()}
      ${repeat(
				this.choices,
				choice => choice.name,
				choice => html`
					<div>${choice.name}</div>
				`,
			)}
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
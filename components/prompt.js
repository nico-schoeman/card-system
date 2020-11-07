import { html, render } from 'lit-html/lit-html.js';

export class Prompt extends HTMLElement {
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
      <div>prompt</div>
		`;
//TODO: prompt display
  style () {
    return html`
      <style>
        c-prompt {
          position: absolute;
        }
      </style>
    `;
  }
}

if (!customElements.get('c-prompt')) {
	customElements.define('c-prompt', Prompt);
}
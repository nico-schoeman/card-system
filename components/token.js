import { html, render } from 'lit-html/lit-html.js';

export class Token extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		render(this.template(), this);

    this.addEventListener('dragover', event => {
      event.preventDefault();
    });
    this.addEventListener('dragenter', event => {
      console.log('dragenter');
      this.classList.add('drop-over');
    });
    this.addEventListener('dragleave', event => {
      console.log('dragleave');
      this.classList.remove('drop-over');
    });
    this.addEventListener('drop', event => {
      console.log('drop', event, window.drag_card);
      this.classList.remove('drop-over');
      if (window.drag_card) window.drag_card.playCard(this);
    });
	}

	disconnectedCallback() {
		this.unsubscribe();
	}

  template = () =>
		html`
      ${this.style()}
      <h1>TOKEN</h1>
		`;

  style () {
    return html`
      <style>
        c-token {
					position: relative;
					width: var(--token-width);
					height: var(--token-height);
					transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
					cursor: pointer;
					user-select: none;
          border: 2px solid black;
          border-radius: 50%;
				}

        c-token.drop-over {
          border: 2px dashed orange;
          box-shadow: 0 0 1em yellow
        }
      </style>
    `;
  }
}

if (!customElements.get('c-token')) {
	customElements.define('c-token', Token);
}
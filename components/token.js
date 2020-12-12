import { html, render } from 'lit-html/lit-html.js';
import { SetupDrop } from '../index.js';

export class Token extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		render(this.template(), this);

    this.unsubEvents = SetupDrop(this);
	}

	disconnectedCallback() {
		this.unsubEvents();
	}

  template = () =>
		html`
      ${this.style()}
      <div
      class='token'>
      </div>
		`;

  style () {
    return html`
      <style>
        c-token {
					position: relative;
					width: 100%;
					height: 100%;
					transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
					cursor: pointer;
					user-select: none;
				}

        .token {
					position: absolute;
					background: gray;
					border: 2px solid black;
          border-radius: 50%;
					width: var(--token-width);
					height: var(--token-height);
					box-shadow: 0 0 1em;
					transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
				}

        c-token.highlight-hover .token {
          border-radius: 50%;
          border: 4px dashed orange;
        }

        c-token.highlight-valid .token, c-token.highlight-prompt .token {
          box-shadow: 0 0 1em green;
        }

        c-token .token {
          pointer-events: none;
        }

        c-token[disabled] {
          pointer-events: none;
        }
      </style>
    `;
  }
}

if (!customElements.get('c-token')) {
	customElements.define('c-token', Token);
}
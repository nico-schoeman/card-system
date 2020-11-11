import { html, render } from 'lit-html/lit-html.js';
import { SetupDrop } from '../index.js';

import './token.js';

export class Stage extends HTMLElement {
	constructor() {
		super();
	}

  init() {
    this.tokens = this.store.store.get('tokens');
    render(this.template(), this);
  }

	connectedCallback() {
    this.init();
    this.unsubscribe = this.store.store.subscribe(() => { //TODO: store.store syntax sucks
			this.init();
		}, 'tokens');

		render(this.template(), this);

    this.unsubEvents = SetupDrop(this);
	}

	disconnectedCallback() {
    this.unsubEvents();
		this.unsubscribe();
	}

  template = () =>
		html`
      ${this.style()}

      ${this.tokens
				? this.tokens.map(
						(token, index) =>
							html`
								<c-token .data=${{ ...token }}></c-token>
							`,
				  )
				: ``}
		`;

  style () {
    return html`
      <style>
        c-stage {
          --token-width: 20vh;
          --token-height: calc(20vh * 1.25);
          --stage-height: var(--token-height);
          justify-items: center;
          justify-content: center;
          align-self: flex-end;
          height: var(--stage-height);
          width: 80%;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(10%, max-content));
          background: gray;
        }

        c-stage[disabled] c-token {
          pointer-events: none;
        }

        c-stage.highlight-hover {
          border: 2px dashed orange;
          box-shadow: 0 0 1em yellow
        }
      </style>
    `;
  }
}

if (!customElements.get('c-stage')) {
	customElements.define('c-stage', Stage);
}
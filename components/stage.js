import { html, render } from 'lit-html/lit-html.js';
import './token.js';

export class Stage extends HTMLElement {
	constructor() {
		super();
	}

  init() {
    this.tokens = this.store.get('tokens');
    render(this.template(), this);
  }

	connectedCallback() {
    this.init();
    this.unsubscribe = this.store.subscribe(() => {
			this.init();
		}, 'tokens');

		render(this.template(), this);
	}

	disconnectedCallback() {
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
        }
      </style>
    `;
  }
}

if (!customElements.get('c-stage')) {
	customElements.define('c-stage', Stage);
}
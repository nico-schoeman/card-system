import { html, render } from 'lit-html/lit-html.js';
import { repeat } from 'lit-html/directives/repeat.js';

export class Tooltip extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		render(this.template(), this);
	}

  template = () =>
		html`
      ${this.style()}

      <div class='tooltip'>${this.tip.decorated} <p>${this.tip.content}</p></div>
		`;

  style () {
    return html`
      <style>
        .tips {
          position: absolute;
          display: inline-block;
          border-bottom: 1px dotted black;
          visibility: hidden;
          opacity: 0;
          z-index: 10;
          background-color: black;
          width: 120px;
          bottom: 100%;
          transition: all 3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        c-tooltip .tooltip {
          color: #fff;
          text-align: center;
          padding: 0.3em 0;
          border-radius: 6px;
          z-index: 1;
          white-space: pre-line;
        }

        c-tooltip .tooltip p {
          margin: 0.2em;
        }

        c-card:hover .tips {
          visibility: visible;
          opacity: 1;
        }

        c-tooltip .tooltip::after {
          content: " ";
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: black transparent transparent transparent;
        }
      </style>
    `;
  }
}

if (!customElements.get('c-tooltip')) {
	customElements.define('c-tooltip', Tooltip);
}
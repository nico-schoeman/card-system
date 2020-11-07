import { html, render } from 'lit-html/lit-html.js';

export class Tooltip extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
    console.log(this.tip);
		render(this.template(), this);
    let tooltip = this.querySelector('.tooltip');
    tooltip.innerHTML += this.tip.decorated;
    tooltip.innerHTML += `<p>${this.tip.content}</p>`;
	}

  template = () =>
		html`
      ${this.style()}

      <div class='tooltip'></div>
		`;

  style () {
    return html`
      <style>
        .tips {
          position: absolute;
          display: inline-block;
          visibility: hidden;
          opacity: 0;
          z-index: 10;
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
          background-color: rgba(50, 50, 50, 0.8);
          margin: 0.2em;
          font-size: 0.8em;
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
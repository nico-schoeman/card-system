import { html, render } from 'lit-html/lit-html.js';

export class Tooltip extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
    this.tipKeys = Object.keys(this.tips);
    console.log(this.tips);
		render(this.template(), this);
	}

  template = () =>
		html`
      ${this.style()}

      ${this.tipKeys.map(key => {
        let tip = this.tips[key];
        return html`<div class='tooltip'>${tip.decorated} <p>${tip.content}</p></div>`
      })}
		`;

    //TODO: nested tooltips

  style () {
    return html`
      <style>
        /* Tooltip container */
        c-tooltip {
          position: absolute;
          display: inline-block;
          border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
          visibility: hidden;
          opacity: 0;
          z-index: 10;
          background-color: black;
          width: 120px;
          bottom: 100%;
        }

        /* Tooltip text */
        c-tooltip .tooltip {
          color: #fff;
          text-align: center;
          padding: 0.3em 0;
          border-radius: 6px;
          transition: all 3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 1;
        }

        c-tooltip .tooltip p {
          margin: 0.2em;
        }

        c-card:hover c-tooltip {
          visibility: visible;
          opacity: 1;
        }

        c-tooltip .tooltip::after {
          content: " ";
          position: absolute;
          top: 100%; /* At the bottom of the tooltip */
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
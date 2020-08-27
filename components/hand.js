import { html, render } from 'lit-html/lit-html.js';
import { store } from '../store.js';
import './card.js';
import { selectHand } from '../card.store.js';

export class Hand extends HTMLElement {
	constructor() {
		super();
	}

	template = () =>
		html`
      <style>
        c-hand {
          --card-width: 20vh;
          --card-height: calc(20vh * 1.25);
          --hand-height: calc(var(--card-height) / 2);
          justify-items: center;
          justify-content: center;
          align-self: flex-end;
          position: absolute;
          height: var(--hand-height);
          width: 80%;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(10%, max-content));
        }
      </style>

			${this.cards
				? this.cards.map(
						(card, index) =>
							html`
								<c-card draggable=true .data=${{ ...card }}></c-card>
							`,
				  )
				: ``}
		`;

	init() {
		this.cards = [];
		this.newCards = selectHand();
    console.log(this.newCards);
		this.cards.forEach(card => {
			if (!this.newCards.includes(card)) this.cards = this.cards.filter(check => check != card);
		});

		this.newCards = this.newCards.filter(card => {
			if (!this.cards.includes(card)) return card;
		});

		this.newCards.forEach((card, index) => {
			//Stagger the draw annimation
			setTimeout(() => {
				this.cards.push(card);
				render(this.template(), this);
			}, 500 * index);
		});

		if (window.events) {
			window.events.RemoveListener('context-menu', this.contextMenu);
			window.events.AddListener('context-menu', this.contextMenu);
		}
	}

	contextMenu = () => {
		console.log('show context');
	};

	connectedCallback() {
		//TODO: solve inconsitencies when cards change
		//this.init();
		this.unsubscribe = store.subscribe(() => {
			this.init();
		}, 'hand');

		render(this.template(), this);
	}

	disconnectedCallback() {
		this.unsubscribe();
	}
}

if (!customElements.get('c-hand')) {
	customElements.define('c-hand', Hand);
}

import { html, render } from 'lit-html/lit-html.js';
import { repeat } from 'lit-html/directives/repeat.js';
import './card.js';

export class Hand extends HTMLElement {
	constructor() {
		super();
	}

	init() {
		if (!this.cards) this.cards = [];
		this.newCards = this.store.selectHand();
		this.isCardNew = {};

		if (!this.newCards) return;

		this.cards = this.cards.filter(card => {
			if (this.newCards.includes(card)) {
				this.isCardNew[card.id] = false;
				return card;
			}
		});

		this.newCards = this.newCards.filter(card => {
			if (!this.cards.includes(card)) {
				this.isCardNew[card.id] = true;
				return card;
			}
		});

		this.newCards.forEach((card, index) => {
			//Stagger the draw animation
			setTimeout(() => {
				this.cards.push(card);
				render(this.template(), this);
			}, 500 * index);
		});
	}

	contextMenu = () => {
		console.log('show context');
	};

	connectedCallback() {
		this.init();
		this.unsubscribe = this.store.store.subscribe(() => {
			this.init();
		}, 'hand');

		render(this.template(), this);
	}

	disconnectedCallback() {
		this.unsubscribe();
	}

	template = () =>
		html`
			${this.style()}

			${repeat(
				this.cards,
				card => card.id,
				card => html`
					<c-card
						id=${card.id}
						draggable="true"
						.data=${{ new: this.isCardNew[card.id], card: { ...card }, card_store: this.store }}
					></c-card>
				`,
			)}
		`;

	style() {
		return html`
			<style>
				* {
					--card-width: 10vh;
					--card-height: calc(10vh * 1.25);
					--hand-height: calc(var(--card-height) / 2);
				}

				c-hand {
					justify-items: center;
					justify-content: center;
					align-self: flex-end;
					position: absolute;
					height: var(--hand-height);
					width: 80%;
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(10%, max-content));
				}

				c-hand c-card.ready:hover .card {
					transform: scale(1.5) translateY(calc(-1 * var(--hand-height) / 3)) rotate(-3deg);
					z-index: 1;
				}
			</style>
		`;
	}
}

if (!customElements.get('c-hand')) {
	customElements.define('c-hand', Hand);
}

import { html, render } from 'lit-html/lit-html.js';
import { Discard } from './discard';

export class Card extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		if (!this.data) return;
    
    render(this.template(), this);

    if (window.document.getElementById('draw-pile') && this.data.new) this.pullFrom('draw-pile');

		this.addEventListener('animationstart', event => {
      this.classList.remove('ready');
		});

		this.addEventListener('animationend', () => {
			this.classList.add('ready');
		});

    this.addEventListener('dragstart', event => {
      console.log('dragstart', this.data.card.id);
      window.drag_card = this;
    });

    this.addEventListener('drag', event => {
    });

    this.addEventListener('dragend', event => {
      console.log('dragend', this.data.card.id, event);
    });
	}

	disconnectedCallback() {
		//this.unsubscribe();
	}

  playCard (target) {
    console.log('play card', target, this.data);
    //validate target
    this.data.card_store.discardFromHand([this.data.card]);
    this.data.card.action();

    if (window.document.getElementById('discard-pile')) {
      this.pushTo('discard-pile', () => {
        console.log('discard done', this.data.card_store);
      });
    }
    this.remove();
  }

	clicked() {
		let cards = window.document.getElementsByTagName('c-card');
		for (let i = 0; i < cards.length; i++) {
			if (cards[i].data.card.id != this.data.card.id) cards[i].classList.remove('active');
		}
		//setActiveCard(this.data);
		//this.classList.toggle('active');
	}

  pullFrom (id, callback = null) {
    let card = this.lastElementChild;
    let from = window.document.getElementById(id);
    let cardPos = card.getBoundingClientRect();
    let fromPos = from.getBoundingClientRect();
		card.style.top = `${fromPos.top - cardPos.top}px`;
		card.style.left = `${fromPos.left - cardPos.left}px`;
    card.classList.add('pull');
    card.addEventListener('animationend', () => {
      card.style.top = `0px`;
      card.style.left = `0px`;
      card.classList.remove('pull');
      card.removeEventListener('animationend', this);
      if (callback) callback();
    });
  }

  pushTo (id, callback = null) {
    let to = window.document.getElementById(id);
    let toPos = to.getBoundingClientRect();
    let clone = this.cloneNode(true);
    let card = clone.lastElementChild;
    let cardPos = this.lastElementChild.getBoundingClientRect();
    to.appendChild(clone);
    card.style.top = `${cardPos.top - toPos.top}px`;
		card.style.left = `${cardPos.left - toPos.left}px`;
    card.classList.add('pull');
    card.addEventListener('animationend', () => {
      card.style.top = `0px`;
      card.style.left = `0px`;
      card.classList.remove('pull');
      card.removeEventListener('animationend', this);
      if (callback) callback();
      clone.remove();
    });
  }

	template = () =>
		html`
			${this.style()}
			${this.data && this.data.card.tooltips
				? html`
						<div class="tooltip">
							${this.data.card.tooltips.map(
								tip => html`
									${tip.title} ${tip.content}
								`,
							)}
						</div>
				  `
				: ``}
			<div
				id=${this.data.card.id}
				class="card"
				.data=${this.data.card}
				.onclick=${() => {
					this.clicked();
				}}
			>
				<div class="title">${this.data.card.id}</div>
				<img draggable="false" src=${this.data.card.image.src} />
			</div>
		`;

	style() {
		return html`
			<style>
				c-card {
					position: relative;
					transform: rotate(3deg);
					width: var(--card-width);
					height: var(--card-height);
					cursor: pointer;
					user-select: none;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
				}

				.card {
					position: absolute;
					background: gray;
					border: 2px solid black;
					width: var(--card-width);
					height: var(--card-height);
					box-shadow: 0 0 1em;
					border-radius: 1em;
					transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
				}

				.card:hover {
					box-shadow: 0 0 1em white;
				}

				c-card.active {
					transform: translateY(calc(-1 * var(--hand-height)));
					z-index: 1;
					box-shadow: 0 0 1em yellow;
					opacity: 0.5;
				}

				.card.over {
					transform: scale(0.5);
				}

				.title {
					text-align: center;
					font-size: 25px;
				}

        .pull {
          animation: pull 1s both;
        }

        @keyframes pull {
          100% {
            top: 0px;
            left: 0px;
          }
        }
        @keyframes fade-in {
          0% {
            width: 0;
            height: 0;
          }
          100% {
            width: var(--card-width);
            height: var(--card-height);
          }
        }
        @keyframes fade-out {
          0% {
            width: var(--card-width);
            height: var(--card-height);
          }
          100% {
            width: 0;
            height: 0;
          }
        }
			</style>
		`;
	}
}

if (!customElements.get('c-card')) {
	customElements.define('c-card', Card);
}

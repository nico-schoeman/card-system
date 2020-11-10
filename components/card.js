import { html, render } from 'lit-html/lit-html.js';
import { Discard } from './discard';
import { SetupDrop } from '../utils';
import { repeat } from 'lit-html/directives/repeat.js';
import CardSystem from '..';

import './tooltip.js';

export class Card extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		if (!this.data) return;

    render(this.template(), this);

    if (window.document.getElementById('draw-pile') && this.data.new) this.pullFrom(this, 'draw-pile');

		this.addEventListener('animationstart', event => {
      this.classList.remove('ready');
		});

		this.addEventListener('animationend', () => {
			this.classList.add('ready');
		});

    this.addEventListener('dragstart', event => {
      console.log('dragstart', this.data.card.id);
      window.drag_card = this;

      let validTargets = document.querySelectorAll(this.data.card.validation);
      validTargets.forEach(target => target.classList.add('highlight-valid'));
    });

    this.addEventListener('drag', event => {
    });

    this.addEventListener('dragend', event => {
      console.log('dragend', this.data.card.id, event);

      let validTargets = document.querySelectorAll(this.data.card.validation);
      validTargets.forEach(target => target.classList.remove('highlight-valid'));
    });
    //TODO: investigate drop on nearest target

    this.playCallback = () => {
      this.updateCard();
    }

    CardSystem.getInstance().events.AddListener('play-card', this.playCallback);
	}

	disconnectedCallback() {
    CardSystem.getInstance().events.RemoveListener('play-card', this.playCallback);
	}

  updateCard () {
    let found = this.data.card_store.selectHand().find(card => card.id == this.data.card.id);
    if (found && found.description != this.data.card.description) {
      render(this.template(), this);
    }
  }

  playCard (target) {
    console.log(target);

    if (this.data.card.validation && !target.matches(this.data.card.validation)) return;

    let context = {
      data: this.data,
      card: this.data.card,
      target: target.data
    }
    console.log('play card', context);
    //TODO: validate target, define target types
    this.data.card_store.discardFromHand([this.data.card]);
    this.data.card.execute(context);
    CardSystem.getInstance().events.TriggerEvent('play-card', context);

    if (window.document.getElementById('discard-pile')) {
      this.bump(this, 'discard-pile', () => {
        this.remove();
      });
    }
  }

	clicked() {
		let cards = window.document.getElementsByTagName('c-card');
		for (let i = 0; i < cards.length; i++) {
			if (cards[i].data.card.id != this.data.card.id) cards[i].classList.remove('active');
		}
		//setActiveCard(this.data);
		//this.classList.toggle('active');
	}

	template = () =>
		html`
			${this.style()}

			<div
				id=${this.data.card.id}
				class="card"
				.data=${this.data.card}
				.onclick=${() => {
					this.clicked();
				}}
			>
        <div class='tips'>
        ${repeat(
          Object.values(this.data.card.tips),
          tip => tip.content,
          tip => html`<c-tooltip .tip=${tip}></c-tooltip>`,
        )}
        </div>
				<div class="title">${this.data.card.id}</div>
				<img draggable="false" src=${this.data.card.image.src} />
			</div>
		`;

  drawTips () {
    if (this.data && this.data.card.tips)
      return html`
        <c-tooltip .tips=${this.data.card.tips} .description=${this.data.card.description}></c-tooltip>
			`;
    else return ``;
  }

	style() {
		return html`
			<style>
				c-card {
          --target-top: 0px;
          --target-left: 0px;
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

        c-card[disabled] {
          pointer-events: none;
        }

        .pull {
          animation: move 1s both reverse, fade 1s;
        }

        .push {
          animation: move 1s both, fade 1s reverse;
        }

        .bump {
          animation: move 0.3s ease-out alternate 2;
        }

        @keyframes move {
          0% {
            top: 0px;
            left: 0px;
          }
          100% {
            top: var(--target-top);
            left: var(--target-left);
          }
        }
        @keyframes fade {
          0% {
            width: 0;
            height: 0;
          }
          100% {
            width: var(--card-width);
            height: var(--card-height);
          }
        }
			</style>
		`;
	}
}// animation: pull 1s both alternate 2;
//TODO: move anims to shared
//TODO: bump

if (!customElements.get('c-card')) {
	customElements.define('c-card', Card);
}

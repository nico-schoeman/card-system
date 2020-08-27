import { html, render } from 'lit-html/lit-html.js';
import { store } from '../store.js';
import { setActiveCard } from '../card.store.js';

export class Card extends HTMLElement {
	constructor() {
		super();
	}

	template = () =>
		html`
      <style>
        c-card {
          position: relative;
          transform: rotate(3deg);
          width: var(--card-width);
          height: var(--card-height);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          animation: draw 1s both;
          cursor: pointer;
          user-select: none;
        }

        c-card.ready:hover {
          transform: scale(1.5) translateY(calc(-1 * var(--hand-height)));
          z-index: 1;
        }

        .card {
          position: absolute;
          top: 0px;
          left: 0px;
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

        @keyframes draw {
          0% {
            bottom: -100vw;
            width: 0;
            height: 0;
          }
          100% {
            bottom: 0px;
            width: var(--card-width);
            height: var(--card-height);
          }
        }
      </style>

			${this.data.tooltips
				? html`
						<div class="tooltip">
							${this.data.tooltips.map(
								tip => html`
									${tip.title} ${tip.content}
								`,
							)}
						</div>
				  `
				: ``}
			<div
				id=${this.data.id}
				class="card"
				.data=${this.data}
				.onclick=${() => {
					this.clicked();
				}}
			>
				<div class="title">${this.data.name}</div>
        <img draggable=false src=${this.data.image.src}>
			</div>
		`;

	connectedCallback() {
		render(this.template(), this);

		this.addEventListener('animationstart', event => {
			this.classList.add('animate');
		});

		this.addEventListener('animationend', () => {
			this.classList.remove('animate');
			this.classList.add('ready');
		});

		// this.addEventListener('dragstart', event => {
		// 	this.classList.remove('ready');
		// 	this.classList.remove('active');
		// 	this.classList.add('drag');

		// 	window.drag_id = this.data.id;
		// 	console.log(event);
		// 	// let old_element = window.document.getElementById(window.drag_id); //????????
		// 	// let element = old_element.cloneNode(true); //window.document.createElement(old_element);
		// 	// element.style.transform = 'scale(0.5)';
		// 	// window.document.body.appendChild(element);
		// 	// event.dataTransfer.setDragImage(element, 0, 0);
		// 	// element.style.display = 'none';

		// 	//this.drag_ghost = window.document.getElementById(window.drag_id).cloneNode(true);
		// 	//this.drag_ghost.classList.add('drag_ghost');
		// 	//window.document.body.appendChild(this.drag_ghost);
		// 	//event.dataTransfer.setDragImage(this.drag_ghost, event.offsetX, event.offsetY);
		// });

		// this.addEventListener('dragend', event => {
		// 	this.classList.remove('drag');
		// 	this.classList.add('ready');
		// 	window.document.body.removeChild(this.drag_ghost);
		// });
	}

	disconnectedCallback() {
		this.unsubscribe();
	}

  clicked () {
    let cards = window.document.getElementsByTagName('c-card');
		for (let i = 0; i < cards.length; i++) {
      if (cards[i].data.id != this.data.id) cards[i].classList.remove('active');
    };
    setActiveCard(this.data);
    this.classList.toggle('active');
  }
}

if (!customElements.get('c-card')) {
	customElements.define('c-card', Card);
}

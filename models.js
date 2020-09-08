import { html } from 'lit-html/lit-html.js';

let id_counter = 0;

export function Stats () {
  this.health = 100;
  this.speed = 1;
}

export function Card () {
  this.id = 'card_' + id_counter++;
  this.name = "card";
  this.tags = [];
  this.image = new Image();
  this.image.src = 'images/cultist.svg';
  this.stats = {
    cost: 0
  }
  this.tooltips = [
    new Tooltip('test', 'test')
  ];
  this.effects = [(context) => {
    console.log('can do action');
  }];
  this.action = (context) => {
    console.log("action:", this, this.id, this.name);
    this.effects.forEach(effect => {
      effect();
    });
  };
};

export function UnitCard () {
  let card = new Card();
  card.action = (context) => {
    console.log("spawn action", card.unit);
  };
  card.unit = new UnitModel();
  return card;
}

export function Tooltip (title, content) {
  return {
    title: html`
      <div>${title}:</div>
    `,
    content: html`
      <div>${content}</div>
    `
  }
}
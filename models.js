import { html } from 'lit-html/lit-html.js';

let id_counter = 0;

export function Stats () {
  this.health = 100;
  this.speed = 1;
}

export function Card () {
  this.id = 'card_' + id_counter++;
  this.name = "card";
  this.description = '';
  this.tags = [];
  this.image = new Image();
  this.image.src = 'images/cultist.svg';
  this.stats = {
    cost: 0
  }
  this.tips = {};
  this.actions = {};
  this.execute = (context) => {
  };
};

export function UnitCard () {
  let card = new Card();
  card.execute = (context) => {
    console.log("spawn action", card.unit);
  };
  card.unit = new UnitModel();
  return card;
}
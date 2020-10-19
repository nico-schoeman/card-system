import { html } from 'lit-html/lit-html.js';

let id_counter = 0;

export function Card () {
  this.id = 'card_' + id_counter++;
  this.name = "card";
  this.description = '';
  this.tags = [];
  this.image = new Image();
  this.image.src = 'images/cultist.svg';
  this.stats = {}
  this.tips = {};
  this.actions = {};
  this.execute = (context) => {
  };
};

export function Token () {
  this.id = 'token_' + id_counter++;
  this.name = "token";
  this.description = '';
  this.tags = [];
  this.image = new Image();
  this.image.src = 'images/cultist.svg';
  this.stats = {}
  this.tips = {};
}
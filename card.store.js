import DataStore from '@nico-schoeman/data-store';

export default class CardStore extends DataStore {

  constructor (collectionStore = null, tipStore = null) {
    super();
    this.set('deck', []);
    this.set('draw', []);
    this.set('discard', []);
    this.set('grave', []);
    this.set('hand', []);
    this.set('tokens', []);
    this.set('active-card', null);
    if (collectionStore) this.set('collection', collectionStore);
    if (tipStore) this.set('tips', tipStore);
  }
}

Array.prototype.pickRandom = function() {
	return this[Math.floor(Math.random() * this.length)];
};

CardStore.prototype.randomCard = function () {
	return Object.values(this.get('all-cards')).pickRandom()();
}

CardStore.prototype.addCardToDeck = function (card) {
  let deck = this.get('deck');
  card.stage = 'deck';
  deck.push(card);
  this.set('deck', [...deck]);
}

CardStore.prototype.setDraw = function(deck = this.get('deck')) {
  deck.forEach(card => card.stage = 'draw');
	this.set('draw', [...deck]);
}

CardStore.prototype.shuffleDraw = function () {
	let draw = this.get('draw');

	for (let i = draw.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * i);
		let temp = draw[i];
		draw[i] = draw[j];
		draw[j] = temp;
	}

  this.set('draw', [...draw]);
}

CardStore.prototype.drawUntil = function (count) {
  let draw = this.get('draw');
  let hand = this.get('hand');

  while (hand.length < count) {
    if (draw.length) {
      let card = draw.pop();
      card.stage = 'hand';
      hand.push(card);
    } else {
      break;
    }
  }

  this.set('draw', [...draw]);
  this.set('hand', [...hand]);
}

CardStore.prototype.drawAmount = function (amount) {
  let draw = this.get('draw');
  let hand = this.get('hand');

  for (let i = 0; i < amount; i++) {
    if (draw.length) {
      let card = draw.pop();
      card.stage = 'hand';
      hand.push(card);
    }
  }

  this.set('draw', [...draw]);
  this.set('hand', [...hand]);
}

CardStore.prototype.discard = function (arrayName, card) {
  let discard = this.get('discard');
  let target = this.get(arrayName);

  target = target.filter(item => item.id != card.id);
  card.stage = 'discard';
  discard.push(card);

  this.set('discard', [...discard]);
  this.set(arrayName, [...target]);
}

CardStore.prototype.discardFromHand = function (cards = []) {
  cards.forEach(card => {
    card.stage = 'discard';
    this.discard('hand', card);
  });
}

CardStore.prototype.discardFromHandRandom = function (amount) {
  for (let index = 0; index < amount; index++) {
    let hand = this.get('hand');
    let card = hand.pickRandom();
    card.stage = 'discard';
    this.discard('hand', card);
  }
}

CardStore.prototype.discardFromDraw = function (cards = []) {
  cards.forEach(card => {
    card.stage = 'discard';
    this.discard('draw', card);
  });
}

CardStore.prototype.discardFromDrawRandom  = function (amount) {
  for (let index = 0; index < amount; index++) {
    let draw = this.get('draw');
    let card = draw.pickRandom();
    card.stage = 'discard';
    this.discard('draw', card);
  }
}

CardStore.prototype.refresh = function (arrayName, card) {
  let draw = this.get('draw');
  let target = this.get(arrayName);

  target = target.filter(item => item.id != card.id);
  card.stage = 'draw';
  draw.push(card);

  this.set('draw', [...draw]);
  this.set(arrayName, [...target]);
}

CardStore.prototype.refreshDrawFromDiscard = function (amount) {
  for (let index = 0; index < amount; index++) {
    let discard = this.get('discard');
    let card = discard.pickRandom();
    card.stage = 'draw';
    this.refresh('discard', discard.pickRandom());
  }
}

CardStore.prototype.setActiveCard = function (card) {
  let current = this.get('active-card');
  this.store.set('active-card', current&&current.id==card.id? null : card);
}

CardStore.prototype.forceUpdateAll = function () {
  this.set('deck', [...this.get('deck')]);
	this.set('draw', [...this.get('draw')]);
	this.set('discard', [...this.get('discard')]);
	this.set('grave', [...this.get('grave')]);
	this.set('hand', [...this.get('hand')]);
  this.set('tokens', [...this.get('tokens')]);
}

CardStore.prototype.selectDeck = function () {
  return this.get('deck');
}
CardStore.prototype.selectDraw = function () {
  return this.get('draw');
}
CardStore.prototype.selectDiscard = function () {
  return this.get('discard');
}
CardStore.prototype.selectHand = function () {
  return this.get('hand');
}
CardStore.prototype.selectActiveCard = function () {
  return this.get('active-card');
}
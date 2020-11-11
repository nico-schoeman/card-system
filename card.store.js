import DataStore from '@nico-schoeman/data-store';

export default function CardStore(collectionStore = null, tipStore = null) {
	this.store = new DataStore();

  this.store.set('deck', []);
	this.store.set('draw', []);
	this.store.set('discard', []);
	this.store.set('grave', []);
	this.store.set('hand', []);
  this.store.set('tokens', []);
  this.store.set('active-card', null);
  if (collectionStore) this.store.set('collection', collectionStore);
  if (tipStore) this.store.set('tips', tipStore);
}

Array.prototype.pickRandom = function() {
	return this[Math.floor(Math.random() * this.length)];
};

CardStore.prototype.randomCard = function () {
	return Object.values(this.store.get('all-cards')).pickRandom()();
}

CardStore.prototype.addCardToDeck = function (card) {
  let deck = this.store.get('deck');
  card.stage = 'deck';
  deck.push(card);
  this.store.set('deck', [...deck]);
}

CardStore.prototype.setDraw = function(deck = this.store.get('deck')) {
  deck.forEach(card => card.stage = 'draw');
	this.store.set('draw', [...deck]);
}

CardStore.prototype.shuffleDraw = function () {
	let draw = this.store.get('draw');

	for (let i = draw.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * i);
		let temp = draw[i];
		draw[i] = draw[j];
		draw[j] = temp;
	}

  this.store.set('draw', [...draw]);
}

CardStore.prototype.drawUntil = function (count) {
  let draw = this.store.get('draw');
  let hand = this.store.get('hand');

  while (hand.length < count) {
    if (draw.length) {
      let card = draw.pop();
      card.stage = 'hand';
      hand.push(card);
    } else {
      break;
    }
  }

  this.store.set('draw', [...draw]);
  this.store.set('hand', [...hand]);
}

CardStore.prototype.drawAmount = function (amount) {
  let draw = this.store.get('draw');
  let hand = this.store.get('hand');

  for (let i = 0; i < amount; i++) {
    if (draw.length) {
      let card = draw.pop();
      card.stage = 'hand';
      hand.push(card);
    }
  }

  this.store.set('draw', [...draw]);
  this.store.set('hand', [...hand]);
}

CardStore.prototype.discard = function (arrayName, card) {
  let discard = this.store.get('discard');
  let target = this.store.get(arrayName);

  target = target.filter(item => item.id != card.id);
  card.stage = 'discard';
  discard.push(card);

  this.store.set('discard', [...discard]);
  this.store.set(arrayName, [...target]);
}

CardStore.prototype.discardFromHand = function (cards = []) {
  cards.forEach(card => {
    card.stage = 'discard';
    this.discard('hand', card);
  });
}

CardStore.prototype.discardFromHandRandom = function (amount) {
  for (let index = 0; index < amount; index++) {
    let hand = this.store.get('hand');
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
    let draw = this.store.get('draw');
    let card = draw.pickRandom();
    card.stage = 'discard';
    this.discard('draw', card);
  }
}

CardStore.prototype.refresh = function (arrayName, card) {
  let draw = this.store.get('draw');
  let target = this.store.get(arrayName);

  target = target.filter(item => item.id != card.id);
  card.stage = 'draw';
  draw.push(card);

  this.store.set('draw', [...draw]);
  this.store.set(arrayName, [...target]);
}

CardStore.prototype.refreshDrawFromDiscard = function (amount) {
  for (let index = 0; index < amount; index++) {
    let discard = this.store.get('discard');
    let card = discard.pickRandom();
    card.stage = 'draw';
    this.refresh('discard', discard.pickRandom());
  }
}

CardStore.prototype.setActiveCard = function (card) {
  let current = this.store.get('active-card');
  this.store.set('active-card', current&&current.id==card.id? null : card);
}

CardStore.prototype.forceUpdateAll = function () {
  this.store.set('deck', [...this.store.get('deck')]);
	this.store.set('draw', [...this.store.get('draw')]);
	this.store.set('discard', [...this.store.get('discard')]);
	this.store.set('grave', [...this.store.get('grave')]);
	this.store.set('hand', [...this.store.get('hand')]);
  this.store.set('tokens', [...this.store.get('tokens')]);
}

CardStore.prototype.selectDeck = function () {
  return this.store.get('deck');
}
CardStore.prototype.selectDraw = function () {
  return this.store.get('draw');
}
CardStore.prototype.selectDiscard = function () {
  return this.store.get('discard');
}
CardStore.prototype.selectHand = function () {
  return this.store.get('hand');
}
CardStore.prototype.selectActiveCard = function () {
  return this.store.get('active-card');
}
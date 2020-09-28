import DataStore from '@nico-schoeman/data-store';

export default function CardStore() {
	this.store = new DataStore();

  this.store.set('deck', []);
	this.store.set('draw', []);
	this.store.set('discard', []);
	this.store.set('grave', []);
	this.store.set('hand', []);
  this.store.set('active-card', null);
}

Array.prototype.pickRandom = function() {
	return this[Math.floor(Math.random() * this.length)];
};

CardStore.prototype.randomCard = function () {
	return Object.values(this.store.get('all-cards')).pickRandom()();
}

CardStore.prototype.addCardToDeck = function (card) {
  let deck = this.store.get('deck');
  deck.push(card);
  this.store.set('deck', [...deck]);
}

CardStore.prototype.setDraw = function(deck = this.store.get('deck')) {
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
      hand.push(draw.pop());
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
    if (draw.length)
    hand.push(draw.pop());
  }

  this.store.set('draw', [...draw]);
  this.store.set('hand', [...hand]);
}

CardStore.prototype.discard = function (arrayName, card) {
  let discard = this.store.get('discard');
  let target = this.store.get(arrayName);

  target = target.filter(item => item.id != card.id);
  discard.push(card);

  this.store.set('discard', [...discard]);
  this.store.set(arrayName, [...target]);
}

CardStore.prototype.discardFromHand = function (cards = []) {
  cards.forEach(card => {
    this.discard('hand', card);
  });
}

CardStore.prototype.discardFromHandRandom = function (amount) {
  for (let index = 0; index < amount; index++) {
    let hand = this.store.get('hand');
    this.discard('hand', hand.pickRandom());
  }
}

CardStore.prototype.discardFromDraw = function (cards = []) {
  cards.forEach(card => {
    this.discard('draw', card);
  });
}

CardStore.prototype.discardFromDrawRandom  = function (amount) {
  for (let index = 0; index < amount; index++) {
    let draw = this.store.get('draw');
    this.discard('draw', draw.pickRandom());
  }
}

CardStore.prototype.refresh = function (arrayName, card) {
  let draw = this.store.get('draw');
  let target = this.store.get(arrayName);

  target = target.filter(item => item.id != card.id);
  draw.push(card);

  this.store.set('draw', [...draw]);
  this.store.set(arrayName, [...target]);
}

CardStore.prototype.refreshDrawFromDiscard = function (amount) {
  for (let index = 0; index < amount; index++) {
    let discard = this.store.get('discard');
    this.refresh('discard', discard.pickRandom());
  }
}

CardStore.prototype.setActiveCard = function (card) {
  let current = this.store.get('active-card');
  this.store.set('active-card', current&&current.id==card.id? null : card);
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
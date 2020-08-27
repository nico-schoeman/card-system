import { store } from './store';
import { BasicCard } from './card.factory';

Array.prototype.pickRandom = function() {
	return this[Math.floor(Math.random() * this.length)];
};

export function randomCard() {
	return Object.values(store.get('all-cards')).pickRandom()();
}

export function setupCardState() {
	let deck = [randomCard(), randomCard()];
	store.set('deck', deck);
	store.set('draw', []);
	store.set('discard', []);
	store.set('grave', []);
	store.set('hand', []);
  store.set('active-card', null);
}

export function setDraw(deck = store.get('deck')) {
	store.set('draw', deck);
}

export function shuffleDraw() {
	let draw = store.get('draw');

	for (let i = draw.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * i);
		let temp = draw[i];
		draw[i] = draw[j];
		draw[j] = temp;
	}

  store.set('draw', draw);
}

export function drawUntil (count) {
  let draw = store.get('draw');
  let hand = store.get('hand');

  while (hand.length < count - 1) {
    if (draw.length) {
      hand.push(draw.pop());
    } else {
      break;
    }
  }

  store.set('draw', draw);
  store.set('hand', hand);
}

export function drawAmount(amount) {
  let draw = store.get('draw');
  let hand = store.get('hand');

  for (let i = 0; i < amount; i++) {
    if (draw.length)
    hand.push(draw.pop());
  }

  store.set('draw', draw);
  store.set('hand', hand);
}

export function discardCardFromHand (card) {
  let discard = store.get('discard');
  let hand = store.get('hand');

  hand.filter(item => item.id != card.id);
  discard.push(card);

  store.set('discard', discard);
  store.set('hand', hand);
}

export function discardCardsFronHand (cards) {

}

export function discardRandomCardsFromHand (amount) {

}

export function discardCardFromDraw (card) {

}

export function discardCardsFronDraw (cards) {

}

export function discardRandomCardsFromDraw (amount) {

}

export function refreshDrawFromDiscard (amount) {

}

export function setActiveCard(card) {
  let current = store.get('active-card');
  store.set('active-card', current&&current.id==card.id? null : card);
}

export let selectDeck = () => store.get('deck');
export let selectDraw = () => store.get('draw');
export let selectDiscard = () => store.get('discard');
export let selectHand = () => store.get('hand');
export let selectActiveCard = () => store.get('active-card');
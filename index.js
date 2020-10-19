import DataStore from '@nico-schoeman/data-store';
import CardFactory from './card.factory.js';
import EventManager from '@nico-schoeman/event-bus/event-manager.js';
import CardStore from './card.store.js';

import './components/hand.js';
import './components/stage.js';
import './components/deck.js';
import './components/discard.js';

export default function CardSystem() {
  if (!CardSystem._instance) {
    CardSystem._instance = this;
    this.events = new EventManager();
    this.cardStore = new CardStore();
    this.tokenStore = new DataStore();
    this.factory = new CardFactory(this.events);
  }

  CardSystem.getInstance = function () {
    return this._instance;
  }

  return CardSystem._instance;
}
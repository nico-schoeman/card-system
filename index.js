import { html } from 'lit-html';
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
    this.events = new EventManager(this);
    this.cardStore = new CardStore(this);
    this.factory = new CardFactory(this);
  }

  CardSystem.getInstance = function () {
    return this._instance;
  }

  return CardSystem._instance;
}

CardSystem.prototype.triggers = {};
CardSystem.prototype.actions = {};
CardSystem.prototype.checks = {};
CardSystem.prototype.tips = {};

CardSystem.prototype.setTrigger = function (key, description) {
  this.triggers[key] = {key, description}
}

CardSystem.prototype.setAction = function (key, task, description) {
  this.actions[key] = {key, task, description};
};

CardSystem.prototype.setCheck = function (key, check, description) {
  this.checks[key] = {key, check, description};
}

CardSystem.prototype.setTip = function (key, content, color = 'black') {
  this.tips[key] = {key, content, decorated: html`<b style='color:${color}'>${key}</b>`};
}

CardSystem.prototype.execute = function (context, trigger = null) {
  for(var action in context.card.actions) {
    let data = context.card.actions[action];
    if ((trigger && data.trigger != trigger) || (!trigger && data.trigger)) continue;
    console.log(`do ${action} ${trigger}`, context.card);

    let repeat = context.card.stats.repeat || 1;
    for (let index = 0; index < repeat; index++) {
      let canDo = false;
      if (data.check) canDo = this.checks[data.check].check(context);
      else canDo = true;
      if (canDo) this.actions[action].task(context);
    }
  }
}

//TODO: keep a log of played cards

CardSystem.prototype.addAction = function (card, action, check = null, trigger = null) {
  card.actions[action] = {action, check, trigger};

  if (trigger) {
    this.events.AddListener(trigger, (context) => {
      context.card = card;
      this.execute(context, trigger)
    });
  }

  this.generateDescription(card, action, check, trigger);

}

CardSystem.prototype.generateDescription = function (card, action, check = null, trigger = null) {
  let triggerText = '';
  if (trigger) {
    triggerText = this.triggers[trigger].description;
    let triggerMatches = triggerText.match(/\[(.*?)\]/gi);
    if (triggerMatches) triggerMatches.forEach(stat => {
      stat = stat.replace('[','').replace(']','');
      triggerText = triggerText.replace(`[${stat}]`, card.stats[stat]);
    });
  }

  let checkText = '';
  if (check) {
    checkText = this.checks[check].description;
    let checkMatches = checkText.match(/\[(.*?)\]/gi);
    if (checkMatches) checkMatches.forEach(stat => {
      stat = stat.replace('[','').replace(']','');
      checkText = checkText.replace(`[${stat}]`, card.stats[stat]);
    });
  }

  let actionText = this.actions[action].description;
  let actionMatches = actionText.match(/\[(.*?)\]/gi);
  if (actionMatches) actionMatches.forEach(stat => {
    stat = stat.replace('[','').replace(']','');
    actionText = actionText.replace(`[${stat}]`, card.stats[stat]);
  });
  card.description += trigger? `${triggerText}: ` : '';
  card.description += check ? `${checkText}: ${actionText}\n` : `${actionText}\n`;

  this.generateTips(card);
}

CardSystem.prototype.generateTips = function (card) {
  card.tips['description'] = {key: 'description', content: card.description, decorated: card.name};
  for(var key in this.tips) {
    if (card.description.includes(key)) card.tips[key] = {key, content: this.tips[key].content, decorated: this.tips[key].decorated};
  }
}
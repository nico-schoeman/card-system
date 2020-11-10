import { html } from 'lit-html';
import DataStore from '@nico-schoeman/data-store';
import CardFactory from './card.factory.js';
import EventManager from '@nico-schoeman/event-bus/event-manager.js';
import CardStore from './card.store.js';

import './components/hand.js';
import './components/stage.js';
import './components/deck.js';
import './components/discard.js';
import './components/prompt.js';

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
CardSystem.prototype.prompts = {};
CardSystem.prototype.checks = {};
CardSystem.prototype.tips = {};

CardSystem.prototype.setTrigger = function (key, description) {
  this.triggers[key] = {key, description}
}

CardSystem.prototype.setAction = function (key, task, description) {
  this.actions[key] = {key, task, description};
};

CardSystem.prototype.setPrompt = function (key, prompt, description) {
  this.prompts[key] = {key, prompt, description};
};

CardSystem.prototype.setCheck = function (key, check, description) {
  this.checks[key] = {key, check, description};
}

CardSystem.prototype.setTip = function (key, content, color = 'black') {
  this.tips[key] = {key, content, decorated: `<b style='color:${color}'>${key}</b>`};
}

CardSystem.prototype.execute = async function (context, trigger = null) {
  for(let action in context.card.actions) {
    let data = context.card.actions[action];
    if ((trigger && data.trigger != trigger) || (!trigger && data.trigger)) continue;

    if (data.prompt) {
      let selection = await this.prompts[data.prompt].prompt(context);
      context.target = selection.data;
      this.doExecute(context, data, action);
      return;
    };

    this.doExecute(context, data, action);
  }
}

CardSystem.prototype.doExecute = function (context, data, action) {
  console.log(`do ${action}`, context);
  let repeat = context.card.stats.repeat || 1;
  for (let index = 0; index < repeat; index++) {
    let canDo = false;
    if (data.check)
      canDo = this.checks[data.check].check(context);
    else
      canDo = true;
    if (canDo) {
      this.actions[action].task(context);
      this.generateDescription(context.card);
    }
  }
}

//TODO: keep a log of played cards, turn by turn and total

CardSystem.prototype.addAction = function (card, action, check = null, trigger = null, prompt = null) {
  card.actions[action] = {action, check, trigger, prompt};

  if (trigger) {
    this.events.AddListener(trigger, (context) => {
      context.card = card;
      this.execute(context, trigger)
    });
  }

  this.generateDescription(card);
}

CardSystem.prototype.generateDescription = function (card) {
  card.description = '';

  for(let action in card.actions) {
    let triggerText = this.getDescription(this.triggers, card.actions[action].trigger, card);
    let checkText = this.getDescription(this.checks, card.actions[action].check, card);
    let promptText = this.getDescription(this.prompts, card.actions[action].prompt, card);
    let actionText = this.getDescription(this.actions, action, card);

    card.description += triggerText? `${triggerText}: ` : '';
    card.description += promptText? `${promptText}: ` : '';
    card.description += checkText ? `${checkText}: ${actionText}\n` : `${actionText}\n`;
  }

  this.generateTips(card);
}

CardSystem.prototype.generateTips = function (card) {
  card.tips['description'] = {key: 'description', content: card.description, decorated: card.name};
  for(let key in this.tips) {
    if (card.description.includes(key)) card.tips[key] = {key, content: this.tips[key].content, decorated: this.tips[key].decorated};
  }
}

CardSystem.prototype.prompt = async function (query) {
  let prompt = document.createElement("c-prompt");
  document.body.appendChild(prompt);

  let all = document.querySelectorAll("c-card, c-token");
  all.forEach(item => item.setAttribute('disabled', ''));

  let unsub = null;
  let selection = await new Promise((resolve, reject) => {
    let callback = event => {
      resolve(event.target);
    };

    let targets = document.querySelectorAll(query);
    targets.forEach(item => {
      item.removeAttribute('disabled', '');
      item.addEventListener('click', callback);
      item.classList.add('highlight-prompt')
    });
    unsub = () => {
      targets.forEach(item => {
        item.removeEventListener('click', callback)
        item.classList.remove('highlight-prompt')
      });
      all.forEach(item => item.removeAttribute('disabled', ''));
      prompt.remove();
    }
  });

  unsub();
  return selection;
}

CardSystem.prototype.getDescription = function (array, key, card) {
  if (!key) return '';

  let text = array[key].description;
  let matches = text.match(/\[(.*?)\]/gi);
  if (matches)
    matches.forEach(stat => {
      stat = stat.replace('[', '').replace(']', '');
      text = text.replace(`[${stat}]`, card.stats[stat]);
    });

  for (let tip in this.tips) {
    matches = text.match(tip);
    if (matches)
      matches.forEach(match => {
        text = text.replace(tip, this.tips[tip].decorated);
      });
  };

  return text;
}

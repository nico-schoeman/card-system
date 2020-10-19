import { Card, Token } from './models';
import { html } from 'lit-html';

export default function CardFactory(events) {
  this.events = events;
}

CardFactory.prototype.BasicCard = function() {
	let card = new Card();
  card.stats.cost = 1;
	card.execute = context => {
		this.execute(context);
	};
  return card;
};

CardFactory.prototype.BasicToken = function() {
  let token = new Token();
	token.stats.health = 100;
  return token;
};

CardFactory.prototype.triggers = {};
CardFactory.prototype.actions = {};
CardFactory.prototype.checks = {};
CardFactory.prototype.tips = {};

CardFactory.prototype.addTrigger = function (key, description) {
  this.triggers[key] = {key, description}
}

CardFactory.prototype.addAction = function (key, task, description) {
  this.actions[key] = {key, task, description};
};

CardFactory.prototype.addCheck = function (key, check, description) {
  this.checks[key] = {key, check, description};
}

CardFactory.prototype.addTip = function (key, content, color = 'black') {
  this.tips[key] = {key, content, decorated: html`<b style='color:${color}'>${key}</b>`};
}

CardFactory.prototype.execute = function (context, trigger = null) {
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

CardFactory.prototype.addCardAction = function (card, action, check = null, trigger = null) {
  card.actions[action] = {action, check, trigger};

  if (trigger) {
    this.events.AddListener(trigger, (context) => {
      context.card = card;
      this.execute(context, trigger)
    });
  }

  this.generateDescription(card, action, check, trigger);

}

CardFactory.prototype.generateDescription = function (card, action, check = null, trigger = null) {
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

CardFactory.prototype.generateTips = function (card) {
  for(var key in this.tips) {
    if (card.description.includes(key)) card.tips[key] = {key, content: this.tips[key].content, decorated: this.tips[key].decorated};
  }
}
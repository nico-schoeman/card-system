import { Card, UnitCard as Unit } from './models';
import { html } from 'lit-html';

export default function CardFactory() {

}

CardFactory.prototype.BasicCard = function() {
	let card = new Card();
	card.execute = context => {
		this.execute(context);
	};
  return card;
};

CardFactory.prototype.UnitCard = function() {
  let card = new Unit();
  card.name = 'UNIT',
	card.execute = context => {
		this.execute(context);
	};
  return card;
};

CardFactory.prototype.actions = {};
CardFactory.prototype.checks = {};
CardFactory.prototype.tips = {};

CardFactory.prototype.addAction = function (key, task, description) {
  this.actions[key] = {key, task, description};
};

CardFactory.prototype.addCheck = function (key, check, description) {
  this.checks[key] = {key, check, description};
}

CardFactory.prototype.addTip = function (key, content, color = 'black') {
  this.tips[key] = {key, content, decorated: html`<b style='color:${color}'>${key}</b>`};
}

CardFactory.prototype.execute = function (context) {
  for(var action in context.card.actions) {
    let data = context.card.actions[action];
    let repeat = context.card.stats.repeat || 1;
    for (let index = 0; index < repeat; index++) {
      let canDo = false;
      if (data.check) canDo = this.checks[data.check].check(context);
      if (canDo) this.actions[action].task(context);
    }
  }
}

CardFactory.prototype.addCardAction = function (card, key, check = null) {
  card.actions[key] = {key, check};
  this.generateDescription(card, key, check);
}

CardFactory.prototype.generateDescription = function (card, key, check = null) {
  let checkText = this.checks[check].description;
  let checkMatches = checkText.match(/\[(.*?)\]/gi);
  if (checkMatches) checkMatches.forEach(stat => {
    stat = stat.replace('[','').replace(']','');
    checkText = checkText.replace(`[${stat}]`, card.stats[stat]);
  });

  let actionText = this.actions[key].description;
  let actionMatches = actionText.match(/\[(.*?)\]/gi);
  if (actionMatches) actionMatches.forEach(stat => {
    stat = stat.replace('[','').replace(']','');
    actionText = actionText.replace(`[${stat}]`, card.stats[stat]);
  });
  card.description += check ? `${checkText}: ${actionText}\n` : `${actionText}\n`;

  this.generateTips(card);
}

CardFactory.prototype.generateTips = function (card) {
  for(var key in this.tips) {
    if (card.description.includes(key)) card.tips[key] = {key, content: this.tips[key].content, decorated: this.tips[key].decorated};
  }
}
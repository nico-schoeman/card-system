let id_counter = 0;

export function Card () {
  this.id = id_counter++;
  this.name = "card";
  this.description = '';
  this.tags = [];
  this.image = new Image();
  this.image.src = 'images/cultist.svg';
  this.stage = ''; //where this card currently is deck/hand/discard
  this.stats = {};
  this.status = {}; //status effects on this card {effectName: effectValue}
  this.tips = {};
  this.validation = 'c-token'; //the target validation query for this card
  this.actions = {};
};

export default function CardFactory(system) {
  this.system = system;
}

CardFactory.prototype.BasicCard = function() {
	let card = new Card();
  card.stats.cost = 1;
  return card;
};

CardFactory.prototype.BasicToken = function() {
  let token = new Card();
  token.name = 'Token';
	token.stats.health = 100;
  return token;
};
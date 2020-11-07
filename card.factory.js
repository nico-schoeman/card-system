let id_counter = 0;

export function Card () {
  this.id = id_counter++;
  this.name = "card";
  this.description = '';
  this.tags = [];
  this.image = new Image();
  this.image.src = 'images/cultist.svg';
  this.stats = {};
  this.status = {};
  this.tips = {};
  this.validations = {};
  this.actions = {};
  this.execute = (context) => {
  };
};

export default function CardFactory(system) {
  this.system = system;
}

CardFactory.prototype.BasicCard = function() {
	let card = new Card();
  card.stats.cost = 1;
	card.execute = context => {
		this.system.execute(context);
	};
  return card;
};

CardFactory.prototype.BasicToken = function() {
  let token = new Card();
  token.name = 'Token';
	token.stats.health = 100;
  return token;
};
export default function CardLog(system) {
  this.system = system;

  this.turnCount = 0;
  this.turn = {};

  this.system.events.AddListener('next-turn', () => {
    this.turnCount++;
    this.turn[this.turnCount] = [];
  });

  this.system.events.AddListener('play-card', (context) => {
    if (!this.turn[this.turnCount]) this.turn[this.turnCount] = [];
    this.turn[this.turnCount].push(context);
  });
}
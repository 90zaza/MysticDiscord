module.exports = class Pokemons {
  constructor() {
    this.pokemonsData = require('../data/pokemons.json');
    this.calculateRanks();
  }

  get() {
    return this.pokemonsData;
  }

  calculateRanks() {
    for (let i = 0; i < this.pokemonsData.length; i++) {

      this.pokemonsData[i].ranks = [1, 1, 1];
      let stats = this.pokemonsData[i].stats;
      for (let j = 0; j < this.pokemonsData.length; j++) {

        if (this.pokemonsData[j].stats[0] > stats[0]) {
          ++this.pokemonsData[i].ranks[0];
        }
        if (this.pokemonsData[j].stats[1] > stats[1]) {
          ++this.pokemonsData[i].ranks[1];
        }
        if (this.pokemonsData[j].stats[2] > stats[2]) {
          ++this.pokemonsData[i].ranks[2];
        }
      }
    }
  }
}

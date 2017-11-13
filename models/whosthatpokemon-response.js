const Discord = require('discord.js');
const Message = require('./message');

const whosThatPokemon = require('../data/whos-that-pokemon.json')

module.exports = class GenericResponse extends Message {
  constructor(message) {
    super(message);

    if(this.startsWith('whosthatpokemon') || this.startsWith('wieisdezepokemon')) {
      let pokemonNumber = 802;

      const gen = this.findGen();
      pokemonNumber = Math.floor(Math.random() * gen.value);

      if (pokemonNumber < 10){
        pokemonNumber = `00${pokemonNumber}`;
      }
      else if (pokemonNumber < 100){
        pokemonNumber = `0${pokemonNumber}`;
      }

      this.newMessage(pokemonNumber);
    }
  }

  findGen() {
    return this.startsWithKey(whosThatPokemon);
  }

  newMessage(pokemonNumber) {
    const img = `https://i0.wp.com/delftmystic.files.wordpress.com/2017/11/silhouette-${pokemonNumber}1.png`
    const embed = new Discord.MessageEmbed()
     .setTitle(`Who's That Pokémon?`)
     .setThumbnail(img)
     .setDescription("Raad als eerste welke Pokémon dit is!")

    super.newMessage({embed});
  }
}

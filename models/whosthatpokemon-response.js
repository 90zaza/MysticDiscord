const Discord = require('discord.js');
const Message = require('./message');

const whosThatPokemon = [
  {
    keys: [
      'whosthatpokemon gen 1',
      'wieisdezepokemon gen 1',
      'whosthatpokemon gen1',
      'wieisdezepokemon gen1'
    ],
    value: 151
  },
  {
    keys: [
      'whosthatpokemon gen 2',
      'wieisdezepokemon gen 2',
      'whosthatpokemon gen2',
      'wieisdezepokemon gen2'
    ],
    value: 251
  },
  {
    keys: [
      'whosthatpokemon gen 3',
      'wieisdezepokemon gen 3',
      'whosthatpokemon gen3',
      'wieisdezepokemon gen3'
    ],
    value: 386
  },
  {
    keys: [
      'whosthatpokemon gen 4',
      'wieisdezepokemon gen 4',
      'whosthatpokemon gen4',
      'wieisdezepokemon gen4'
    ],
    value: 493
  },
  {
    keys: [
      'whosthatpokemon gen 5',
      'wieisdezepokemon gen 5',
      'whosthatpokemon gen5',
      'wieisdezepokemon gen5'
    ],
    value: 649
  },
  {
    keys: [
      'whosthatpokemon gen 6',
      'wieisdezepokemon gen 6',
      'whosthatpokemon gen6',
      'wieisdezepokemon gen6'
    ],
    value: 721
  },
  {
    keys: [
      'whosthatpokemon',
      'wieisdezepokemon'
    ],
    value: 802
  }
]

module.exports = class GenericResponse extends Message {
  constructor(message) {
    super(message);

    let pokemonNumber = 802;

    if(this.startsWith('whosthatpokemon') || this.startsWith('wieisdezepokemon')) {
      const gen = this.findGen();
      pokemonNumber = Math.floor(Math.random() * gen.value);

      if (pokemonNumber < 10){
        pokemonNumber = `00${pokemonNumber}`;
      }
      else if (pokemonNumber < 100){
        pokemonNumber = `0${pokemonNumber}`;
      }
    }

    this.newMessage(pokemonNumber);
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

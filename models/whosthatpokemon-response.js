const Discord = require('discord.js');
const Message = require('./message');

const whosThatPokemon = require('../data/whos-that-pokemon.json')
const pokemons = require('../data/pokemon.json');

module.exports = class GenericResponse extends Message {
  constructor(message) {
    super(message);

    const gen = this.findGen();

    if(gen) {
      let pokemonNumber = 802;

      pokemonNumber = Math.floor(Math.random() * (gen.value2-gen.value1)+gen.value1);

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
    let silhouette
    silhouette = `https://i0.wp.com/delftmystic.files.wordpress.com/2017/11/silhouette-${pokemonNumber}1.png`
    if(pokemonNumber==784){
      silhouette = `https://i2.wp.com/delftmystic.files.wordpress.com/2017/11/silhouette-7842.png`
    }
    if(pokemonNumber==785){
      silhouette = `https://i0.wp.com/delftmystic.files.wordpress.com/2017/11/silhouette-785.png`
    }


    let colored;
    if(pokemonNumber>721){
      colored = `https://img.pokemondb.net/sprites/sun-moon/dex/normal/${pokemons[Number(pokemonNumber)+5].name.toLowerCase()}.png`
    } else {
      colored = `https://img.pokemondb.net/sprites/x-y/normal/${pokemons[Number(pokemonNumber)+5].name.toLowerCase()}.png`
    }
    if(pokemonNumber == 29) { //nidoranf
      colored = `https://img.pokemondb.net/sprites/x-y/normal/nidoran-f.png`
    }
    if(pokemonNumber == 32) { //nidoranm
      colored = `https://img.pokemondb.net/sprites/x-y/normal/nidoran-m.png`
    }

    const embed = new Discord.MessageEmbed()
     .setTitle(`Who's That Pokémon?`)
     .setThumbnail(silhouette)
     .setDescription("Raad binnen 20 seconden welke Pokémon dit is!")
    super.newMessage({embed});

    setTimeout(() => {
      const embed = new Discord.MessageEmbed()
        .setTitle(`Het is.... ${pokemons[Number(pokemonNumber)+5].name}`)
        .setThumbnail(colored)
        .setDescription(`:balloon: :tada: :balloon: :tada: :balloon:`);
      super.newMessage({embed})
    }, 2000)
  }
}

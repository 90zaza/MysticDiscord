const Discord = require('discord.js');
const pokemons = require('../data/pokemons.json');

exports.checkForPokemon = function (msgText) {

  let pokemon = pokemons.find((p) => {

    if (!p.keys) {
      console.log('no rare pokemon found', p);
      return;
    }
    return p.keys.find((key) => {
      return msgText.includes(key);
    });
  });

  return pokemon;
}

exports.reply = function (msg, pokemon) {
  if (pokemon.rare == false) {return}
  msg.channel.send(pokemon.name + ` is gevonden, @everyone!`);
}

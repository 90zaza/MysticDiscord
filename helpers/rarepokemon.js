const Discord = require('discord.js');
const Rarepokemons = require('../data/rarepokemon.json');

exports.checkForRarepokemon = function (msgText) {

  let rarepokemon = Rarepokemons.find((g) => {
    if (!g.keys) {
      console.log('rarepokemon has no key', g);
      return;
    }
    return g.keys.find((key) => {
      return msgText.startsWith(key);
    });
  });

  return rarepokemon;
}

exports.reply = function (msg, rarepokemon) {
  msg.channel.send(rarepokemon.name + ` is gespot @everyone!`);
}

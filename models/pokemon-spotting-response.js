const Discord = require('discord.js');
const Message = require('./message');
const pokemons = require('../data/pokemon.json');

module.exports = class PokemonSpottingResponse extends Message {
  constructor(message) {
    super(message);

    // TODO maybe we could also place this in the normal index. Because the channel doesnt change over time right?
    this.spotting = this.message.guild.channels.find('name', 'pokemon_spotting');
    console.log("test");
    if (this.message.channel == this.spotting) {
      if (this.message.content.includes('shiny') || this.message.content.includes('shiney')) {
        this.replypm(`Shiny's zijn helaas individueel bepaald. Voor jou een shiny is voor een ander dus waarschijnlijk gewoon normaal.`, true);
        return;
      }

      if (this.message.content.includes('100%') || this.message.content.includes('100 %') || this.message.content.includes('100 p') || this.message.content.includes('100p') || this.message.content.includes('perfect')) {
        this.newMessage('Er is een 100% IV pokémon gespot, @everyone! (alleen voor lvl 30+)', true);
        return;
      }

      this.pokemon = this.getPokemon();
      if (this.pokemon && this.pokemon.rare) {
        this.newMessage(`${this.pokemon.name} is gevonden, @everyone!`, true);
      }
    }
  }

  getPokemon() {
    return this.includes(pokemons);
  }
}

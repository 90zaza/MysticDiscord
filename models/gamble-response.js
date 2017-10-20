const Discord = require('discord.js');
const Message = require('./message');
const replies = require('../data/reply.json');

module.exports = class GenericResponse extends Message {
  constructor(message) {
    super(message);

    if(this.startsWith('gamble')) {
      const gambleValue = (Math.floor(Math.random()*6)+1);
      this.reply(`<:game_die:349868481673428992>: ${gambleValue}`);
    }
  }
}

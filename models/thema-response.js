const Discord = require('discord.js');
const Message = require('./message');
const thema = require('../data/thema.json');

module.exports = class GenericResponse extends Message {
  constructor(message) {
    super(message);

    // startsWith is only necessary because its different then the normal messages
    if(this.startsWith('thema') || this.startsWith('theme')) {
      this.thema = this.getThema();
      if(this.thema) {
        this.newMessage();
      }
    }
  }

  getThema() {
    // TODO: we should refactor this because 29 is now harcoded. if we add one more this isnt updated automatically

    // dont copy this as example code, this is different then most other implementations.
    const key = Math.floor(Math.random() * 71)+1;
    return thema.find( (themaItem) => {
      return themaItem.keys.find((themaItemKey) => {
        return themaItemKey == key;
      });
    })
  }

  newMessage() {
    const embed = new Discord.MessageEmbed()
      .setTitle("Thema Gym suggestie:")
      .setColor(0x0000ff)
      .setDescription(this.thema.suggestion);
    super.newMessage({embed});
  }
}

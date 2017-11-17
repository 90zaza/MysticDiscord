const Discord = require('discord.js');
const Message = require('./message');
const thema = require('../data/thema.json');

module.exports = class GenericResponse extends Message {
  constructor(message) {
    super(message);
    if(this.startsWith('thema') || this.startsWith('theme')) {
      const rand = Math.floor(Math.random() * thema.length);
      console.log(rand);
      console.log(thema[rand]);
      const embed = new Discord.MessageEmbed()
        .setTitle("Thema Gym suggestie:")
        .setColor(0x0000ff)
        .setDescription(thema[rand].suggestion);
      super.newMessage({embed});
    }
  }
}

const Discord = require('discord.js');
const Message = require('./message');
const music = require('../data/music.json');

module.exports = class GenericResponse extends Message {
  constructor(message) {
    super(message);

    if(this.startsWith('music') || this.startsWith('muziek')) {
      const rand = Math.floor(Math.random() * music.length);

      const embed = new Discord.MessageEmbed()
        .setTitle(":musical_note:" + music[rand].name + ":musical_note:")
        .setURL(music[rand].url)
        .setDescription(music[rand].text);
        super.newMessage({embed});
    }
  }
}

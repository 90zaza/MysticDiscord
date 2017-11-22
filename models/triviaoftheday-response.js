const Discord = require('discord.js');
const Message = require('./message');
const trivia = require('../data/triviaoftheday.json');

module.exports = class GenericResponse extends Message {
  constructor(message) {
    super(message);

    if(this.startsWith('trivia')) {

      var date = new Date();
      const embed = new Discord.MessageEmbed()
        .setTitle(`:thinking:Trivia of the day: ${date.getUTCDate()}:thinking:`)
        .setThumbnail(trivia[date.getUTCDate()-1].img)
        .setDescription(trivia[date.getUTCDate()-1].trivia);
      super.newMessage({embed});
    }
  }
}

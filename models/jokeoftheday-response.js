const Discord = require('discord.js');
const Message = require('./message');
const joke = require('../data/jokeoftheday.json');

module.exports = class GenericResponse extends Message {
  constructor(message) {
    super(message);

    if(this.startsWith('joke') || this.startsWith('mop') || this.startsWith('grap')) {

      var date = new Date();
      const embed = new Discord.MessageEmbed()
        .setTitle(`:joy:Joke of the day: ${date.getUTCDate()}:joy:`)
        .setThumbnail(joke[date.getUTCDate()-1].img)
        .setDescription(joke[date.getUTCDate()-1].joke);
      super.newMessage({embed});
    }
  }
}

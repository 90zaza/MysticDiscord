const Discord = require('discord.js');
const Message = require('./message');
const joke = require('../data/jokeoftheday.json');

module.exports = class GenericResponse extends Message {
  constructor(message) {
    super(message);

    // startsWith is only necessary because its different then the normal messages
    if(this.startsWith('joke') || this.startsWith('mop') || this.startsWith('grap')) {
      this.joke = this.getJoke();
      if(this.joke) {
        this.newMessage();
      }
    }
  }

  getJoke() {
    var date = new Date();
    var dagNr = date.getUTCDate();
    const key = dagNr;
    return joke.find( (jokeItem) => {
      return jokeItem.keys.find((jokeItemKey) => {
        return jokeItemKey == key;
      });
    })
  }

  newMessage() {
    var date = new Date();
    var dagNr = date.getUTCDate();
    const embed = new Discord.MessageEmbed()
      .setTitle(`:joy:Joke of the day: ${dagNr}:joy:`)
      .setThumbnail(this.joke.img)
      .setDescription(this.joke.joke);
    super.newMessage({embed});
  }
}

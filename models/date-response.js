const Discord = require('discord.js');
const Message = require('./message');
const dates = require('../data/dates.json');

module.exports = class TopResponse extends Message {
  constructor(message) {
    super(message);
    this.date = this.getDate();

    if(this.date) {
      this.newMessage();
    }
  }

  getDate() {
    return this.totalMatchKey(dates);
  }

  newMessage() {
    let embed = new Discord.RichEmbed()

    .setURL(this.date.url)
    .setTitle(this.date.name)
    .addField(this.date.date, this.date.description)

    super.newMessage({embed});
  }
}

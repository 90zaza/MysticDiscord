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
    if(this.date.sort == overview) {
      embed.setColor(0x0000ff)
    }
    if(this.date.sort == event) {
      embed.setColor(0x00ff00)
    }

    super.newMessage({embed});
  }
}

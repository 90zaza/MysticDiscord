const Discord = require('discord.js');
const Message = require('./message');
const tops = require('../data/top.json');

module.exports = class TopResponse extends Message {
  constructor(message) {
    super(message);

    if(this.startsWith('top ') || this.startsWith('counter ')) {
      this.message.content = `!${this.message.content.substr(this.message.content.indexOf(" ") + 1)}`;

      this.top = this.getTop();

      if(this.top) {
        this.newMessage();
      }
    }
  }


  getTop() {
    return this.totalMatchKey(tops);
  }

  newMessage() {
    let embed = new Discord.MessageEmbed()
      .setTitle(this.top.title)
      .setColor(this.top.color)
      .setDescription(this.top.one +
      this.top.two +
      this.top.three +
      this.top.four +
      this.top.five +
      this.top.six +
      this.top.seven +
      this.top.eight +
      this.top.nine +
      this.top.ten)

      super.newMessage({embed});
  }
}

const Discord = require('discord.js');
const Message = require('./message');
const replies = require('../data/reply.json');

module.exports = class GenericResponse extends Message {
  constructor(message) {
    super(message);
    this.replyObject = this.getReply();

    if(this.replyObject) {
      this.newMessage();
    }
  }

  getReply() {
    return this.totalMatchKey(replies);
  }

  newMessage() {
    const embed =
      new Discord.MessageEmbed()
        .setTitle(this.replyObject.title)
        .setURL(this.replyObject.url)
        .setThumbnail(this.replyObject.img)
        .setDescription(this.replyObject.description);
      super.newMessage({embed});
  }
}

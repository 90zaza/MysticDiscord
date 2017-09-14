const Discord = require('discord.js');
const Message = require('./message');
const replies = require('../data/reply.json');

module.exports = class GenericResponse extends Message {
  constructor(message) {
    super(message);
    this.replyObject = this.getReply();

    if(this.replyObject) {
      this.newMessage(this.replyObject.reply);
    }
  }

  getReply() {
    return this.totalMatchKey(replies);
  }
}

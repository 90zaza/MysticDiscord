const Discord = require('discord.js');
const Message = require('./message');
const replies = require('../data/mentionreply.json');

module.exports = class GenericResponse extends Message {
  constructor(message) {
    super(message);

    if(message.mentions.members.first().user.bot && (message.mentions.members.first().user.username == process.env.BOT_NAME)) {
      this.reply = this.getReply();

      if(this.reply) {
        this.newMessage();
      }



    }
  }

  getReply() {
    return this.includes(replies);
  }

  newMessage() {
    super.newMessage(this.reply.reply, 1);
  }
}

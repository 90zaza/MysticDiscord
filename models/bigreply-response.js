const Discord = require('discord.js');
const Message = require('./message');
const replies = require('../data/bigreply.json');

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
        if (this.replyObject.head1) {
          embed.addField(this.replyObject.head1, this.replyObject.field1)
        }
        if (this.replyObject.head2) {
          embed.addField(this.replyObject.head2, this.replyObject.field2)
        }
        if (this.replyObject.head3) {
          embed.addField(this.replyObject.head3, this.replyObject.field3)
        }
        if (this.replyObject.head4) {
          embed.addField(this.replyObject.head4, this.replyObject.field4)
        }
        if (this.replyObject.head5) {
          embed.addField(this.replyObject.head5, this.replyObject.field5)
        }
        if (this.replyObject.head6) {
          embed.addField(this.replyObject.head6, this.replyObject.field6)
        }
        if (this.replyObject.head7) {
          embed.addField(this.replyObject.head7, this.replyObject.field7)
        }
      super.newMessage({embed});
  }
}

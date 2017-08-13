const settings = require('../settings.json');

module.exports = class Message {
  constructor(message) {
    this.message = message;
  }

  replyTo(content, reply) {
    const isAMatch = settings.prefixs.some((prefix) => {
      if (Array.isArray(content)) {
        return content.find((key) => {
          return this.message.content.startsWith(`${prefix}${key}`);
        });
      } else {
        return this.message.content.toLowerCase() ===
          `${prefix}${content}`;
      }
    });
    if (isAMatch) {
      this.message.reply(reply);
      this.message.delete();
    }
  }

  newMessage(content, reply) {
    const isAMatch = settings.prefixs.some((prefix) => {
      if (Array.isArray(content)) {
        return content.find((key) => {
          return this.message.content.startsWith(`${prefix}${key}`);
        });
      } else {
        return this.message.content.toLowerCase() ===
          `${prefix}${content}`;
      }

    });
    if (isAMatch) {
      this.message.channel.send(reply);
      this.message.delete();
    }
  }
}

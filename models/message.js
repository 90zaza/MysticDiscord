const settings = require('../settings.json');

module.exports = class Message {
  constructor(message) {
    this.message = message;
    this.message.content = this.message.content.trim().toLowerCase();
  }

  startsWithKey(data) {
    return data.find((item) => {
      if (!item.keys) {
        console.log('item has no key', g);
        return;
      }
      return item.keys.find((key) => {
        return this.startsWith(key);
      });
    });
  }

  startsWith(items) {
    return settings.prefixs.some((prefix) => {
      if (Array.isArray(items)) {
        return items.find((item) => {
          return this.message.content.startsWith(`${prefix}${item}`);
        });
      } else {
        return this.message.content.startsWith(`${prefix}${items}`);
      }
    });
  }

  reply(reply) {
    this.message.reply(reply);
    this.message.delete();
  }

  // newMessage(content, reply) {
  //   const isAMatch = settings.prefixs.some((prefix) => {
  //     if (Array.isArray(content)) {
  //       return content.find((key) => {
  //         return this.message.content.toLowerCase().startsWith(
  //           `${prefix}${key}`);
  //       });
  //     } else {
  //       return this.message.content.toLowerCase() ===
  //         `${prefix}${content}`;
  //     }
  //
  //   });
  //   if (isAMatch) {
  //     this.message.channel.send(reply);
  //     this.message.delete();
  //   }
  // }
}

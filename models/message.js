const settings = require('../settings.json');

module.exports = class Message {
  constructor(message) {
    this.message = message;
    this.message.content = this.message.content.trim().toLowerCase();
  }

  includes(data) {
    return data.find((item) => {
      if (!item.keys) {
        console.log('item has no key', item);
        return;
      }
      return item.keys.find((key) => {
        return this.message.content.includes(key);
      });
    });
  }

  totalMatchKey(data) {
    return data.find((item) => {
      if (!item.keys) {
        console.log('item has no key', item);
        return;
      }
      return item.keys.find((key) => {
        return this.totalMatch(key);
      });
    });
  }

  totalMatch(items) {
    return settings.prefixs.some((prefix) => {
      if (Array.isArray(items)) {
        return items.find((item) => {
          return this.message.content === `${prefix}${item}`;
        });
      } else {
        return this.message.content == `${prefix}${items}`;
      }
    });
  }

  startsWithKey(data) {
    return data.find((item) => {
      if (!item.keys) {
        console.log('item has no key', item);
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

  reply(reply, keepOriginalMessage) {
    this.message.reply(reply);
    if(!keepOriginalMessage) {
      this.message.delete();
    }
  }

  newMessage(reply, keepOriginalMessage) {
    this.message.channel.send(reply);

    if(!keepOriginalMessage) {
      this.message.delete();
    }
  }
}

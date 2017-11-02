const Discord = require('discord.js');
const Message = require('./message');
const music = require('../data/music.json');

module.exports = class GenericResponse extends Message {
  constructor(message) {
    super(message);

    // startsWith is only necessary because its different then the normal messages
    if(this.startsWith('music') || this.startsWith('muziek')) {
      this.music = this.getMusic();
      if(this.music) {
        this.reply();
      }
    }
  }

  getMusic() {
    // TODO: we should refactor this because 29 is now harcoded. if we add one more this isnt updated automatically

    // dont copy this as example code, this is different then most other implementations.
    const key = Math.floor(Math.random() * 30);
    return music.find( (musicItem) => {
      return musicItem.keys.find((musicItemKey) => {
        return musicItemKey == key;
      });
    })
  }

  reply() {
    const embed = new Discord.MessageEmbed()
      .setTitle(":musical_note:" + this.music.name + ":musical_note:")
      .setURL(this.music.url)
      .setDescription(this.music.text);
    super.reply({embed});
  }
}

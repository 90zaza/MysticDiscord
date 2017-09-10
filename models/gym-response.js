const Discord = require('discord.js');
const Message = require('./message');
const gyms = require('../data/gyms.json');

module.exports = class GymResponse extends Message {
  constructor(message) {
    super(message);
    this.gym = this.getGym();
    this.reply();
  }

  getGym() {
    let gym = gyms.find((gym) => {
      if (!gym.keys) {
        console.log('gym has no key', g);
        return;
      }
      return gym.keys.find((key) => {
        return this.startsWith(key);
      });
    });

    return gym;
  }

  reply() {
    const embed =
      new Discord.RichEmbed()
        .setColor(0xffffff)
        .setURL(this.gym.url)
        .setTitle("📍 " + this.gym.name);

    super.reply({embed});
  }
}

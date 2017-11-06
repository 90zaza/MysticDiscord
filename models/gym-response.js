const Discord = require('discord.js');
const Message = require('./message');
const gyms = require('../data/gyms.json');

module.exports = class GymResponse extends Message {
  constructor(message) {
    super(message);
    this.gym = this.getGym();

    if(this.gym) {
      this.newMessage();
    }
  }

  getGym() {
    return this.startsWithKey(gyms);
  }

  newMessage() {
    const embed =
      new Discord.MessageEmbed()
        .setColor(0xffffff)
        .setURL(this.gym.url)
        .setTitle("📍 " + this.gym.name);
        if (this.gym.description != 0) {
          embed.setDescription(this.gym.description);
        }
    super.newMessage({embed});
  }
}

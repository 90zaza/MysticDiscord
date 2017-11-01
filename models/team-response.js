const Discord = require('discord.js');
const Message = require('./message');
const teams = require('../data/teams.json');

module.exports = class TeamResponse extends Message {
  constructor(message) {
    super(message);
    this.team = this.getTeam();

    if(this.team) {
      this.newMessage();
    }
  }

  getTeam() {
    return this.totalMatchKey(teams);
  }

  newMessage() {
    let embed = new Discord.MessageEmbed()
      .setColor(this.team.color)
      .setThumbnail(this.team.thumbnail)
      .addField(this.team.field.key, this.team.field.value)

    super.newMessage({embed});

    setTimeout(() => {
      super.newMessage(this.team.afterMessage);
    }, 2000);
  }
}

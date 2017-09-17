const Discord = require('discord.js');
const Message = require('./message');
const channelRoles = require('../data/channel-roles.json');

module.exports = class GenericResponse extends Message {
  constructor(message) {
    super(message);
    this.channelRole = this.getChannelRole();

    if(this.channelRole) {
      this.executeRoleChange();
    }
  }

  getChannelRole() {
    return this.totalMatchKey(channelRoles);
  }

  async executeRoleChange() {
    const action = this.channelRole.action;
    try {
      const role = this.message.guild.roles.find("name", this.channelRole.name);
      if(action === 'add') {
        await this.message.member.addRole(role)
      } else if(action === 'remove') {
        console.log('removing role');
        await this.message.member.removeRole(role)
      }
      this.reply(this.channelRole.reply)
    } catch (error) {
      this.reply('Oepsie, misschien ergens een typ fout?')
      console.error(error);
    }
  }
}

const Discord = require('discord.js');
const Message = require('./message.js');
const channelRoles = require('../data/channel-roles.json');

module.exports = class ChannelRoleResponse extends Message {
  constructor(message) {
    super(message);
    var action
    if (this.startsWith("+")) {action = "add"}
    if (this.startsWith("-")) {action = "remove"}
    this.message.content = `!${this.message.content.substr(2)}`
    this.channelRole = this.getChannelRole();

    if(this.channelRole) {
      this.executeRoleChange();
    }
  }

  getChannelRole() {
    return this.totalMatchKey(channelRoles);
  }

  async executeRoleChange() {
    try {
      const role = this.message.guild.roles.find("name", this.channelRole.name);
      if(this.action === 'add') {
        await this.message.member.addRole(role)
      } else if(this.action === 'remove') {
        console.log('removing role');
        await this.message.member.removeRole(role)
      }
      if (this.channelRole.sort === 'region') {
        this.reply(`Je hebt nu toegang tot het ${this.channelRole.name} kanaal`)
      }
      if (this.channelRole.sort == 'english') {
        this.reply(`You now have access to the English channel`)
      }
      if (this.channelRole.sort === 'pokemon') {
        this.reply(`Je ontvangt nu extra notificaties voor ${this.channelRole.name} raids`)
      }
    } catch (error) {
      this.reply('Rol niet gevonden, typfoutje?')
      console.error(error);
    }
  }
}

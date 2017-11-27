const Discord = require('discord.js');
const Message = require('./message');

module.exports = class GenericResponse extends Message {
  constructor(message) {
    super(message);

   let challenge;
   let title;
   let color;
   let rand;

   //easy challenge
    if(this.startsWith('easy challenge') || this.startsWith('makkelijke uitdaging')) {
      color = 0x00ff00,
      title = "Easy Challenge"
      const easyChallenge = [
        "easy challenge 1",
        "easy challenge 2",
        "etc"
      ];
      rand = Math.floor(Math.random() * easyChallenge.length);
      challenge = easyChallenge[rand]

      const embed = new Discord.MessageEmbed()
        .setTitle(title)
        .setColor(color)
        .setDescription(challenge);
      super.reply({embed});
    }

    //medium challenge
    if(this.startsWith('medium challenge') || this.startsWith('middelmatige uitdaging')) {
      color = 0x0000ff,
      title = "Medium Challenge"
      const mediumChallenge = [
        "medium challenge 1",
        "medium challenge 2",
        "etc"
      ];
      rand = Math.floor(Math.random() * mediumChallenge.length);
      challenge = mediumChallenge[rand]

      const embed = new Discord.MessageEmbed()
        .setTitle(title)
        .setColor(color)
        .setDescription(challenge);
      super.reply({embed});
    }

    //hard challenge
    if(this.startsWith('hard challenge') || this.startsWith('moeilijke uitdaging')) {
      color = 0xff0000,
      title = "Hard Challenge"
      const hardChallenge = [
        "hard challenge 1",
        "hard challenge 2",
        "etc"
      ];
      rand = Math.floor(Math.random() * hardChallenge.length);
      challenge = hardChallenge[rand]

      const embed = new Discord.MessageEmbed()
        .setTitle(title)
        .setColor(color)
        .setDescription(challenge);
      super.reply({embed});
    }



  }
}

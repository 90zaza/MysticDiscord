const Discord = require('discord.js');
const Gyms = require('../data/gyms.json');

exports.checkForGym = function (msgText) {

  let gym = Gyms.find((g) => {
    if (!g.keys) {
      console.log('gym has no key', g);
      return;
    }
    return g.keys.find((key) => {
      return msgText.startsWith(key);
    });
  });

  return gym;
}

exports.reply = function (msg, gym) {

  let embed = new Discord.RichEmbed()
    .setColor(0xffffff)
    .setURL(gym.url)
    .setTitle("📍 " + gym.name);

  msg.channel.send({embed});
  msg.delete()
}

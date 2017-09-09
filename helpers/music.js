const Discord = require('discord.js');
const Musics = require('../data/music.json');

exports.checkForMusic = function (msgText) {

  let music = Musics.find((g) => {
    if (!g.keys) {
      console.log('music has no key', g);
      return;
    }
    return g.keys.find((key) => {
      return msgText == key;
    });
  });

  return music;
}

exports.reply = function (msg, music) {
  let embed = new Discord.RichEmbed()
  .setTitle(":musical_note:" + music.name + ":musical_note:")
  .setURL(music.url)
  .setDescription(music.text);

  msg.channel.send({embed});
  msg.delete()
}

const Discord = require('discord.js');
const Replys = require('../data/reply.json');

exports.checkForReply = function (msgText) {

  let reply = Replys.find((g) => {
    if (!g.keys) {
      console.log('reply has no key', g);
      return;
    }
    return g.keys.find((key) => {
      return msgText == key;
    });
  });

  return reply;
}

exports.reply = function (msg, reply) {
  msg.channel.send(reply.reply);
  msg.delete()
}

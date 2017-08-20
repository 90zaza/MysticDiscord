const Discord = require('discord.js');
const gyms = require('../data/gyms.json');

exports.checkForGym = function (msgText) {

  let gym = gyms.find((g) => {
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

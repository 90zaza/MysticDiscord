const Discord = require('discord.js');
const Sequelize = require('sequelize');
const moment = require('moment');
const Message = require('../models/message');
const pokemons = require('../data/pokemon.json');
const gyms = require('../data/gyms.json');

var connection;
var raids;

//testdiscord
const joinemoji = '➕';
const leaveemoji = '➖';

// initialisation
// connects to database and creates table for raids
exports.init = async () => {
  connection = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: 3306,
      dialect: 'mysql',
      timezone: "+02:00",
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      }
    });

  connection
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });

  raids = connection.define('raid', {
    idraids: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    raidboss: {
      type: Sequelize.STRING,
    },
    raidendtime: {
      type: Sequelize.STRING,
    },
    raidbattletime: {
      type: Sequelize.STRING,
    },
    raidgym: {
      type: Sequelize.STRING,
    },
    // only postgres allows ARRAYS as types, so we have to use this ugly concat strings here
    joining: {
      type: Sequelize.STRING
    },
    messageid: {
      type: Sequelize.STRING,
    },
    expireat: {
      type: Sequelize.DATE
    },
    team: {
      type: Sequelize.STRING
    }
  });

  await raids.sync({
    // force: true
  });
}

// scan incoming messages in the raid channel
exports.scan = async function (msg) {
  try {
    message = new Message(msg);

    // help
    if (/help/.test(message.message.content)) {
      printHelp(message);
    }
    // join
    else if (/join/.test(message.message.content)) {
      joinRaid(message, message.message.content.match(/join (\d+)/)[1], message.message.author);
    }
    // leave
    else if (/leave/.test(message.message.content)) {
      leaveRaid(message, message.message.content.match(/leave (\d+)/)[1], message.message.author);
    }
    // delete raid
    else if (/del (\d+)/.test(message.message.content)) {
      deleteRaid(message, message.message.content.match(/del (\d+)/)[1]);
    }
    // reset
    else if (/reset/.test(message.message.content)) {
      deleteAll(message);
    }
    // update
    else if (/^\d+/.test(message.message.content)) {
      updateRaid(message, message.message.content.match(/(^\d+)/)[1]);
    }
    // new raid
    else if (/^[a-zA-Z]+/.test(message.message.content)) {
      addRaid(message);
    }

  } catch (error) {
    console.log(error);
  }
}

// scan the reaction of the raid message
exports.messageReactionAdd = async function (messageReaction, user) {
  // remove reaction
  messageReaction.remove(user);

  raids.findOne({ where: { "messageid": messageReaction.message.id } })
    .then(async result => {
      if (result != null) {
        const raidschannel = messageReaction.message.client.channels.find("name", "raids");
        const id = result.dataValues.idraids;
        if (messageReaction.emoji == joinemoji) {
          joinRaid(new Message(messageReaction.message), id, user);
          raidschannel.send(`Raid ${id}: ${messageReaction.message.member.guild.member(user).displayName} joined`);
          const role = messageReaction.message.member.guild.roles.find("name", id.toString());
          messageReaction.message.member.guild.member(user).addRole(role);
        } else if (messageReaction.emoji == leaveemoji) {
          leaveRaid(new Message(messageReaction.message), id, user);
          raidschannel.send(`Raid ${id}: ${messageReaction.message.member.guild.member(user).displayName} left`);
          const role = messageReaction.message.member.guild.roles.find("name", id.toString());
          messageReaction.message.member.guild.member(user).removeRole(role);
        } else if (messageReaction.emoji.name == "mystic") {
          await updateRaidTeam(messageReaction.message, raidschannel, "mystic");
          raidschannel.send(`Raid ${messageReaction.message.member.guild.roles.find("name", id.toString())}: ${messageReaction.emoji}`);
        } else if (messageReaction.emoji.name == "valor") {
          await updateRaidTeam(messageReaction.message, raidschannel, "valor");
          raidschannel.send(`Raid ${messageReaction.message.member.guild.roles.find("name", id.toString())}: ${messageReaction.emoji}`);
        } else if (messageReaction.emoji.name == "instinct") {
          await updateRaidTeam(messageReaction.message, raidschannel, "instinct");
          raidschannel.send(`Raid ${messageReaction.message.member.guild.roles.find("name", id.toString())}: ${messageReaction.emoji}`);
        }
      }
    })
    .catch(console.error);
}

async function addRaid(message) {
  const mysticemoji = message.message.guild.emojis.find("name", "mystic");
  const instinctemoji = message.message.guild.emojis.find("name", "instinct");
  const valoremoji = message.message.guild.emojis.find("name", "valor");

  // create raid object
  newRaid = new Raid(message.message.content);

  // check if pokemon is recognised, otherwise just ignore message
  if (newRaid.pokemon) {
    // add raid to db
    raids.create(newRaid.getDatabaseObject())
      // send message of newly created raid with obtained id from the database
      .then(async response => {
        const embed = messageEmbed(null, newRaid, response.dataValues.idraids);
        const raidsmeldingenchannel = message.message.client.channels.find("name", "raids_meldingen");
        raidsmeldingenchannel.send(embed)
          .then(async (m) => {
            // update database with message id
            raids.update(
              { messageid: m.id },
              { where: { idraids: response.dataValues.idraids } })
              .catch(console.error);
            // create role for raid
            m.guild.createRole({
              data: {
                name: response.dataValues.idraids.toString(),
                color: 'DEFAULT',
                mentionable: true
              }
            })
            // notifiy role of raid
            const role = message.message.member.guild.roles.find("name", newRaid.pokemon.name);
            const raidschannel = message.message.guild.channels.find("name", "raids");
            const gymExtension = (newRaid.gym ? " @ " + newRaid.gym.name : "");
            if (role) {
              raidschannel.send(`Raid ${response.dataValues.idraids}: ${role}` + gymExtension);
            } else {
              raidschannel.send(`Raid ${response.dataValues.idraids}: ${newRaid.pokemon.name}` + gymExtension);
            }
            // send reaction emojis
            await m.react("➕")
            await m.react("➖")
            await m.react(mysticemoji);
            await m.react(instinctemoji);
            await m.react(valoremoji);
          })
          .catch(console.error);
      })
      .catch(console.error);
  }
}

async function updateRaid(message, id) {
  // extract information from the message
  newRaid = new Raid(message.message.content);

  // find object
  raids.findById(parseInt(id))
    .then(async result => {
      // update database
      await result.update(newRaid.getDatabaseObject());

      // update message
      message.message.channel.messages.fetch(result.dataValues.messageid)
        .then(m => {
          // update embedded message with new information
          m.edit(messageEmbed(result, newRaid, id));
        })
        .catch(console.error);
    })
    .catch(console.error);
}

async function updateRaidTeam(message, raidschannel, color) {
  const emoji = message.guild.emojis.find("name", color);
  // edit color of message
  message.edit(message.embeds[0].setColor(embedColor(color)));
  // update color of raid in database
  raids.update(
    { team: color },
    { where: { messageid: message.id } })
    .catch(console.error);
}

async function joinRaid(message, id, author) {
  raids.findById(id)
    .then(result => {
      if (result != null) {
        const raidsmeldingenchannel = message.message.client.channels.find("name", "raids_meldingen");
        raidsmeldingenchannel.messages.fetch(result.dataValues.messageid)
          .then(m => {
            const member = message.message.guild.member(author);
            const nickname = member.nickname ? member.nickname : member.user.username;
            // add to previously joined trainers
            joining = result.dataValues.joining ? result.dataValues.joining.split(",").concat(nickname) : [nickname];
            // update message
            newembed = m.embeds[0];
            newembed.fields.filter(field => /^Joining/.test(field.name))[0].value = joining.join("\n");
            m.edit(newembed);
            // update database
            raids.update(
              { joining: joining.join() },
              { where: { idraids: id } })
              .catch(console.error);
            // add user to raid role
            const role = message.message.member.guild.roles.find("name", id.toString());
            message.message.member.addRole(role);
          })
          .catch(console.error);
      }
    })
    .catch(console.error);
}

async function leaveRaid(message, id, author) {
  raids.findById(id)
    .then(result => {
      if (result != null) {
        const raidsmeldingenchannel = message.message.client.channels.find("name", "raids_meldingen");
        raidsmeldingenchannel.messages.fetch(result.dataValues.messageid)
          .then(m => {
            // remove from list
            if (result.dataValues.joining) {
              let joining = result.dataValues.joining.split(",");
              const member = message.message.guild.member(author);
              const nickname = member.nickname ? member.nickname : member.user.username;
              const index = joining.indexOf(nickname);
              if (index > -1) {
                joining.splice(index, 1);
                newembed = m.embeds[0];
                if (joining.length == 0) {
                  newembed.fields.filter(field => /^Joining/.test(field.name))[0].value = "No trainers interested yet";
                } else {
                  newembed.fields.filter(field => /^Joining/.test(field.name))[0].value = joining.join("\n");
                }
                m.edit(newembed);
                // update database
                raids.update(
                  { joining: joining.join() },
                  { where: { idraids: id } })
                  .catch(console.error);
                // remove user from raid role
                const role = message.message.member.guild.roles.find("name", id.toString());
                message.message.member.removeRole(role);
              }
            }
          })
          .catch(console.error);
      }
    })
    .catch(console.error);
}

/**
 * Delete a raid.
 * @param {*Message} message The message
 * @param {*Integer} id The id of the raid
 */
async function deleteRaid(message, id) {
  raids.findById(id)
    .then(result => {
      // delete message in discord
      message.message.channel.messages.fetch(result.dataValues.messageid)
        .then(m => m.delete())
        .catch(console.error);
      // delete message in database
      raids.destroy({
        where: {
          "idraids": id
        }
      })
        .catch(console.error);
      // delete role of raid
      let role = message.message.member.guild.roles.find("name", result.dataValues.idraids.toString());
      if (role) {
        role.delete()
      }
    })
}

async function deleteAll(message) {
  const guild = message.message.guild;
  const channel = message.message.client.channels.find("name", "raids_meldingen");
  // get all raids from the database
  await raids.all()
    .then(results => {
      if (results != undefined) {
        results.forEach(result => {
          // delete message in discord
          let m = channel.messages.get(result.dataValues.messageid);
          if (m) {
            m.delete()
              .catch(console.error);
          }

          // delete role
          let role = guild.roles.find("name", result.dataValues.idraids.toString());
          if (role) {
            role.delete()
          }
        })
      }
    })
    .catch(console.error);

  await raids.truncate();
}

function messageEmbed(result, raid, id) {
  const pokemon = raid.pokemon ? raid.pokemon : (result ? pokemons.find(pokemon => pokemon.name == result.dataValues.raidboss) : null);
  const gym = raid.gym ? raid.gym : (result ? gyms.find(gym => gym.name == result.dataValues.raidgym) : null);
  const endtime = raid.endtime ? raid.endtime : (result ? (result.dataValues.raidendtime ? result.dataValues.raidendtime : null) : null);
  const battletime = raid.battletime ? raid.battletime : (result ? (result.dataValues.raidbattletime ? result.dataValues.raidbattletime : null) : null);
  const team = raid.team ? raid.team : (result ? result.dataValues.team : null);
  const joining = result ? (result.dataValues.joining ? result.dataValues.joining.split(",") : null) : null;

  return new Discord.MessageEmbed()
    .setAuthor("Raid #" + id)
    .setColor(embedColor(team))
    .setTitle(`${pokemon.name}: ${gym ? gym.name : "Gym to be added"}`)
    .setThumbnail(`https://img.pokemondb.net/sprites/x-y/normal/${pokemon.name.toLowerCase()}.png`)
    .addField("End time", `${endtime ? endtime : "to be added"}`, true)
    .addField("Battle time", `${battletime ? battletime : "to be added"}`, true)
    .addField(`Joining (lvl 30 players needed: ~${pokemon.recplayers})`, joining ? joining.join("\n") : "No trainers interested yet")
    .setURL(gym ? gym.url : '');
}

/**
 * Determine the color of the embedded message.
 * @param {*} raid
 */
function embedColor(team) {
  switch (team) {
    case "mystic":
      return 0x0000ff;
    case "valor":
      return 0xff0000;
    case "instinct":
      return 0xffff00;
    default:
      return 0xffffff;
  }
}

/**
 * Data class for raid object
 */
class Raid {
  constructor(messageContent) {
    this.pokemon = extractPokemon(messageContent);
    this.gym = extractGym(messageContent);
    this.team = extractTeam(messageContent);
    Object.assign(this, extractTimes(messageContent));
    // remove all null properties
    Object.keys(this).forEach((key) => (this[key] == null) && delete this[key]);
  }

  getDatabaseObject() {
    let result = {}
    Object.keys(this).forEach((key) => {
      switch (key) {
        case "gym":
          result.raidgym = this.gym.name;
          break;
        case "pokemon":
          result.raidboss = this.pokemon.name;
          break;
        case "endtime":
          result.raidendtime = this.endtime;
          break;
        case "battletime":
          result.raidbattletime = this.battletime;
          break;
        case "team":
          result.team = this.team;
          break;
      }
    });
    return result;
  }

  merge(other) {
    Object.keys(other).forEach((key) => {
      this.key = other.key;
    });
  }
}

/**
 * Returns the team of the gym, otherwise null.
 * @param {Message} message The content of the message
 */
function extractTeam(messageContent) {
  if (/mystic/.test(messageContent)) {
    return "mystic";
  }
  if (/instinct/.test(messageContent)) {
    return "instinct"
  }
  if (/valor/.test(messageContent)) {
    return "valor"
  }
  return null;
}

const RAID_DURATION_MINUTES = 45;
/**
 * Extracts the optional arguments endtime, battletime and hatchtime from the addNewRaid command.
 * @param {*String} str The content of message
 */
function extractTimes(str) {
  var regex = /([ebh]) (\d{1,2})[ :.]?(\d{2})/g;
  let m;
  let times = {};
  while ((m = regex.exec(str)) !== null) {
    switch (m[1]) {
      case "e":
        times.endtime = m[2] + ":" + m[3];
        break;
      case "b":
        times.battletime = m[2] + ":" + m[3];
        break;
      case "h":
        let date = new Date();
        date.setHours(m[2], m[3]);
        date.setMinutes(date.getMinutes() + RAID_DURATION_MINUTES);
        times.endtime = date.getHours() + ":" + date.getMinutes();
        break;
    }
  }
  return times;
}

/**
 * Extracts the gym from the message if present, returns null otherwise.
 * @param {*} message The message
 */
// TODO: Update to regex (is hard though)
function extractGym(messageContent) {
  let textArray = messageContent.split(" ");
  let gymIdx = textArray.indexOf("g");
  let indexes = [textArray.indexOf("e"), textArray.indexOf("b"), textArray.indexOf("g"), textArray.length]
  if (gymIdx >= 0) {
    const gymName = textArray.slice(gymIdx + 1, indexes[indexes.indexOf(gymIdx) + 1]).join(' ');
    const gym = gyms.find((gym) => {
      return gym.keys.find((key) => {
        return gymName.trim().toLowerCase().startsWith(key);
      });
    });
    return gym;
  }
  return null;
}

/**
 * Extracts the pokemon from the message if present, return null otherwise
 * @param {*} message The message
 */
function extractPokemon(messageContent) {
  // old way of extracting the pokemon from the message
  // TODO: update to more efficient method
  let textArray = messageContent.split(" ");
  return pokemons.find((item) => {
    return item.keys.includes(textArray[0]);
  });
}

/**
 * Tests the regex against the string and returns the first match.
 * @param string The string to match the regex against
 * @param regex The regex to match the string against
 */
function matchRegexReturnFirst(string, regex) {
  if (regex.test(string)) {
    return string.match(regex)[1];
  }
  return null;
}

/**
 * Explanation of the raid commands.
 * @param {*Message} message
 */
function printHelp(message) {
  let embed = new Discord.MessageEmbed()
    .setTitle("**Hoe maak ik een raid aan?**")
    .setColor(0xffffff)
    .addField("Nieuwe Raid", "Typ hetvolgende in het raids_meldingen kanaal:\n[pokemon] g [gymnaam] e [eindtijd] b [vechttijd] h [hatchtijd]\nVoorbeeld: **snorlax g seats e 13:00**")
    .addField("Bewerk een raid", "Hetzelfde als een nieuwe raid, maar dan begin je met het RaidID:\n[raidID] g [gymnaam] e [eindtijd] b [vechttijd] h [hatchtijd]\nVoorbeeld: **1 g evenwicht ijzer b 12:00**")
    .addField("Meedoen", "Druk simpelweg op de + onder de raid");

  message.message.channel.send({ embed });
}

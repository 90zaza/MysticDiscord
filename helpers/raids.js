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
// TODO: ask custom emojis from channel instead of hardcoding
const mysticemoji = process.env.MYSTIC_EMOJI;
const instinctemoji = process.env.INSTINCT_EMOJI;
const valoremoji = process.env.VALOR_EMOJI;

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
      defaultValue: "to be added"
    },
    raidendtime: {
      type: Sequelize.STRING,
      defaultValue: "to be added"
    },
    raidbattletime: {
      type: Sequelize.STRING,
      defaultValue: "to be determined"
    },
    raidgym: {
      type: Sequelize.STRING,
      defaultValue: "to be added"
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
      joinRaid(message, message.message.content.match(/join (\d+)/)[1], message.message.author.username);
    }
    // leave
    else if (/leave/.test(message.message.content)) {
      leaveRaid(message, message.message.content.match(/leave (\d+)/)[1], message.message.author.username);
    }
    // delete raid
    else if (/del/.test(message.message.content)) {
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
    // subscribe to raid
    else if (/^\+/.test(message.message.content)) {
      subscribe(message);
    }
    // unsubscribe to raid
    else if (/^\-/.test(message.message.content)) {
      unsubscribe(message);
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
    .then(result => {
      if (result != null) {
        const id = result.dataValues.idraids;
        if (messageReaction.emoji == joinemoji) {
          joinRaid(new Message(messageReaction.message), id, user.username);
        } else if (messageReaction.emoji == leaveemoji) {
          leaveRaid(new Message(messageReaction.message), id, user.username);
        } else if (messageReaction.emoji.name == "mystic") {
          messageReaction.message.edit(messageReaction.message.embeds[0].setColor(embedColor("mystic")));
        } else if (messageReaction.emoji.name == "valor") {
          messageReaction.message.edit(messageReaction.message.embeds[0].setColor(embedColor("valor")));
        } else if (messageReaction.emoji.name == "instinct") {
          messageReaction.message.edit(messageReaction.message.embeds[0].setColor(embedColor("instinct")));
        }
      }
    })
    .catch(console.error);
}

async function addRaid(message) {
  // create raid object
  newRaid = new Raid(message.message.content);

  // check if pokemon is recognised, otherwise just ignore message
  if (newRaid.pokemon) {
    // add raid to db
    raids.create(newRaid.getDatabaseObject())
      // send message of newly created raid with obtained id from the database
      .then(async response => {
        let foo = await
          embed(defaultEmbed(), newRaid, response.dataValues.idraids)
            .then(embed => {
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
                      mentionable: true
                    }
                  })
                  // notifiy role of raid
                  const role = message.message.member.guild.roles.find("name", newRaid.pokemon.name);
                  const raidschannel = message.message.guild.channels.find("name", "raids");
                  if (role) {
                    raidschannel.send(`Raid ${response.dataValues.idraids}: ${role}`);
                  } else {
                    raidschannel.send(`Raid ${response.dataValues.idraids}: ${newRaid.pokemon.name}`);
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
      })
      .catch(console.error);
  }
}

async function updateRaid(message, id) {
  // extract information from the message
  newRaid = new Raid(message.message.content);

  // find object
  raids.findById(id)
    .then(result => {
      // update database
      result.update(newRaid.getDatabaseObject());

      // update message
      message.message.channel.messages.fetch(result.dataValues.messageid)
        .then(m => {
          // update embedded message with new information
          embed(m.embeds[0], newRaid, id)
            .then(embed => {
              m.edit(embed)
                .catch(console.error);
            })
            .catch(console.error);
        })
        .catch(console.error);
    })
    .catch(console.error);
}

// TODO
async function letPeopleKnowOfNewRaid() {
  // Send message to raid channel with new raid
  let raidschannel = message.guild.channels.find("name", "raids");
  if (pokemon.name == "Snorlax" || pokemon.name == "Machamp" || pokemon.name == "Tyranitar" || pokemon.name == "Lapras") {
    let role = message.guild.roles.find("name", pokemon.name);
    raidschannel.send(`Raid ${id}: ${role}`);
  } else {
    raidschannel.send(`Raid ${id}: ${pokemon.name}`);
  }
}

async function joinRaid(message, id, author) {
  raids.findById(id)
    .then(result => {
      if (result != null) {
        const raidsmeldingenchannel = message.message.client.channels.find("name", "raids_meldingen");
        raidsmeldingenchannel.messages.fetch(result.dataValues.messageid)
          .then(m => {
            // add to previously joined trainers
            joining = result.dataValues.joining ? result.dataValues.joining.split(",").concat(author) : [author];
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
              const index = joining.indexOf(author);
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

/**
 * Subscribe to the raids of the specified pokemon.
 * @param {*Message} message
 */
async function subscribe(message) {
  // remove + command
  message.message.content = message.message.content.substring(1);
  // get pokemon
  const pokemon = extractPokemon(message.message.content);
  if (pokemon) {
    // get the role of the pokemon, if not exist create one
    let role = message.message.member.guild.roles.find("name", pokemon.name);
    if (!role) {
      await message.message.member.guild.createRole({
        data: {
          name: pokemon.name,
          mentionable: true
        }
      })
        .then(newrole => role = newrole);
    }
    // add user to role
    message.message.member.addRole(role);
  }
  else {
    message.message.reply("de tekst " + message.message.content + " is niet herkend als een pokemon.");
  }
}

/**
 * Unsubscribe from the raids of the specified pokemon.
 * @param {*Message} message
 */
async function unsubscribe(message) {
  // remove - command
  message.message.content = message.message.content.substring(1);
  const pokemon = extractPokemon(message.message.content);
  if (pokemon) {
    // get the role of the pokemon
    let role = message.message.member.guild.roles.find("name", pokemon.name);
    if (role) {
      // remove user from role
      message.message.member.removeRole(role);
    }
  }
}

function defaultEmbed() {
  return new Discord.MessageEmbed()
    .setColor(0xffffff)
    .addField("End time", "to be added", true)
    .addField("Battle time", "to be determined", true)
    .addField("Joining (bring at least x trainers)", "No trainers interested yet");
}

async function embed(embed, raid, id) {
  embed.setAuthor("Raid #" + id);
  Object.keys(raid).forEach((key) => {
    switch (key) {
      case "gym":
        embed.setURL(raid.gym.url);
        embed.setTitle(embed.title.substring(0, embed.title.length - 17) + ": " + raid.gym.name);
        break;
      case "pokemon":
        embed.setTitle(":round_pushpin:" + raid.pokemon.name + ": Gym to be added");
        embed.setThumbnail(`https://img.pokemondb.net/sprites/x-y/normal/${raid.pokemon.name.toLowerCase()}.png`);
        embed.fields.filter(field => /^Joining/.test(field.name))[0].name = "Joining (bring at least " + raid.pokemon.recplayers + " trainers)";
        break;
      case "endtime":
        embed.fields.filter(field => field.name === "End time")[0].value = raid.endtime;
        break;
      case "battletime":
        embed.fields.filter(field => field.name === "Battle time")[0].value = raid.battletime;
        break;
      case "team":
        embed.setColor(embedColor(raid.team));
        break;
    }
  });
  return embed;
}

/**
 * Determine the color of the embedded message.
 * @param {*} raid
 */
function embedColor(team) {
  switch (team) {
    case "mystic":
      return 0x0677ee;
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
    this.battletime = extractBattleTime(messageContent);
    this.endtime = extractEndTime(messageContent);
    this.team = extractTeam(messageContent);
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

/**
 * Extracts the end time from the message if present, returns null otherwise.
 * @param {Message} message The message
 */
function extractEndTime(messageContent) {
  var regex = /e (\d\d:\d\d)/;
  return matchRegexReturnFirst(messageContent, regex);
}

/**
 * Extracts the battle time from the message if present, returns null otherwise.
 * @param {Message} message The message
 */
function extractBattleTime(messageContent) {
  var regex = /b (\d\d:\d\d)/;
  return matchRegexReturnFirst(messageContent, regex);
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
    .setTitle("**How to use the Raid Bot**")
    .setColor(0xffffff)
    .addField("Add a Raid", "*raid [pokemon] g [gym] e [end time]  b [battle time]* \nPokemon required, g/e/b optional.")
    .addField("Join a raid", "*join [id]*")
    .addField("Leave a raid", "*leave [id]*")
    .addField("Delete a raid", "*del [id]*")
    .addField("Change Raid Parameters", "*[id] [e/g/b] [value]*")
    .addField("Reset the raids", "*reset*");

  message.message.channel.send({ embed });
}

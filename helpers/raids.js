const Discord = require('discord.js');
const Sequelize = require('sequelize');
const moment = require('moment');
const Message = require('../models/message');
const pokemons = require('../data/pokemons.json');
const gyms = require('../data/gyms.json');

var connection;
var raid;
var client;


//testdiscord
const joinemoji = '➕';
const leaveemoji = '➖';
// const mysticemoji = '361948063071338497';
// const instinctemoji = '361948063423791105';
// const valoremoji = '361948063360745474';

// daan

// TODO: ask custom emojis from channel instead of hardcoding
const mysticemoji = '351003868362178561';
const instinctemoji = '351003868542271489';
const valoremoji = '351003870367055883';

//production
//const mysticemoji   = `340033299521077248`
//const instinctemoji = `340033299508363265`
//const valoremoji    = `340141649474617346`

// initialisation
// connects to database and creates table for raids
exports.init = async (otherclient) => {
  client = otherclient;
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

  raid = connection.define('raid', {
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
    joiningAdditions: {
      type: Sequelize.STRING
    },
    messageid: {
      type: Sequelize.STRING,
    },
    expireat: {
      type: Sequelize.DATE
    },
    isMystic: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    }
  });

  await raid.sync({
    // force: true
  });
}

// scan incoming messages in the raid channel
exports.scan = async function (msg) {
  message = new Message(msg);
  // clean input
  let textArray = msg.content.toLowerCase().trim().split(" ");

  // help
  if (/help/.test(message.message.content)) {
    printHelp(message);
  }
  // join
  if (/join/.test(message.message.content)) {
    // TODO
  }
  // leave
  if (/leave/.test(message.message.content)) {
    // TODO
  }
  // delete raid
  if (/del/.test(message.message.content)) {
    deleteRaid(msg, msg.content.match(/del (\d*)/)[1]);
  }
  // reset
  if (/reset/.test(message.message.content)) {
    await raid.truncate();
  }
  // update
  if (/^\d+/.test(message.message.content)) {
    // updateRaid(msg);
    updateRaiddd(message, matchRegexReturnFirst(message.message.content, /(^\d+)/));
  }
  // new raid
  if (/^[a-zA-Z]+/.test(message.message.content)) {
    addRaid2(message);
  }
}

// scan the reaction of the raid message
exports.scanReaction = async function (messageReaction, user) {
  let title = messageReaction.message.embeds[0].author.name;
  let id = title.split(" ")[1][1];

  messageReaction.remove(user);

  if (messageReaction.emoji == joinemoji) {
    //action for one extra player joining
    console.log("join " + id);
    // joinRaid(messageReaction.message, user, id);
  }

  if (messageReaction.emoji == leaveemoji) {
    //action for one less player joining
    console.log("leave")
  }

  if (messageReaction.emoji == mysticemoji) {
    //make raid blue
    console.log("blue")
  }

  if (messageReaction.emoji == valoremoji) {
    //make raid red
    console.log("red")
  }

  if (messageReaction.emoji == instinctemoji) {
    //make raid yellow
    console.log("yellow")
  }
}

async function deleteRaid(msg, id) {

  if (!isNaN(id)) {
    try {
      result = await raid.findOne({
        where: { "idraids": id }
      })
      let raidsmeldingenchannel = msg.guild.channels.find("name", "raids_meldingen");
      raidsmeldingenchannel.messages.find("id", result.dataValues["messageid"]).delete()

      await raid.destroy({
        where: {
          "idraids": id
        }
      })
    } catch (error) {
      // do nothing
    }

  } else {

    raid.findAll({ where: {} }).then(function (x) {
      for (i = 0; i < x.length; i++) {
        let raidsmeldingenchannel = msg.guild.channels.find("name", "raids_meldingen");
        let message = raidsmeldingenchannel.messages.find("id", x[i]["messageid"]);
        if (message) {
          message.delete();
        }
      }
    }).then(function () {
      raid.destroy({
        where: {}
      });
    });
  }
}

function joinRaid(msg, user, id) {

  console.log(msg);
  raid.findOne({ where: { "messageid": msg.id } })
    .then(function (dbRaid) {

      let joining = dbRaid.dataValues.joining
      let joiningAdditions = dbRaid.dataValues.joiningAdditions
      if (!joining) {
        joining = [];
        joiningAdditions = [];
      } else {
        joining = joining.split("; ");
        joiningAdditions = joiningAdditions.split("; ");
      }

      console.log(joining)
      console.log(joiningAdditions)

      let author = user.lastMessage.member.nickname;
      if (author == null) {
        author = user.username
      }

      let authorIndex = joining.indexOf(author);

      if (authorIndex < 0) {
        joining.push(author);
        joiningAdditions.push(0);
      } else {
        joiningAdditions[authorIndex]++;
      }

      let combinedJoin = [];
      combinedJoin.length = joining.length;
      for (var i = 0; i < joining.length; i++) {
        combinedJoin[i] = joining[i];
        if (joiningAdditions[i] > 0) {
          combinedJoin[i] += " + " + joiningAdditions[i];
        }
      }

      raid.update({ "joining": joining.join("; "), "joiningAdditions": joiningAdditions.join("; ") }, {
        where: { "messageid": msg.id },
        returning: true
      })
        .then(async function (result) {

          updateMessage(
            msg,
            dbRaid.dataValues.messageid,
            dbRaid.dataValues.idraids,
            dbRaid.dataValues.raidboss,
            dbRaid.dataValues.raidgym,
            dbRaid.dataValues.raidendtime,
            dbRaid.dataValues.raidbattletime,
            combinedJoin,
            dbRaid.dataValues.isMystic
          )
        })
    });
}

function leaveRaid(msg, id) {

  raid.findOne({ where: { "idraids": id } })
    .then(function (dbRaid) {
      let author = msg.author.lastMessage.member.nickname;
      let join = JSON.parse(dbRaid.dataValues.joining);
      if (author == null) {
        author = msg.author.username
      }
      if (join.indexOf(author) >= 0) {
        join.splice(join.indexOf(author), 1);
      }

      raid.update({ "joining": JSON.stringify(join) }, {
        where: { "idraids": id }
      })
        .then(async function (result) {

          updateMessage(
            msg,
            dbRaid.dataValues.messageid,
            dbRaid.dataValues.idraids,
            dbRaid.dataValues.raidboss,
            dbRaid.dataValues.raidgym,
            dbRaid.dataValues.raidendtime,
            dbRaid.dataValues.raidbattletime,
            join,
            dbRaid.dataValues.isMystic
          )
        })
    });
}

async function addRaid2(message) {
  // create raid object
  newRaiddd = new Raid(message);

  // add raid to db
  raid.create(newRaiddd.getDatabaseObject())
    // send message of newly created raid with obtained id from the database
    .then(async response => {
      let foo = await
        embed(defaultEmbed(), newRaiddd, response.dataValues.idraids)
          .then(embed => {
            let raidsmeldingenchannel = client.channels.find("name", "raids_meldingen");
            raidsmeldingenchannel.send(embed)
              .then(async (message) => {
                // update database with message id
                await raid.update(
                  { messageid: message.id },
                  { where: { idraids: response.dataValues.idraids } })

                // send reaction emojis
                await message.react("➕")
                await message.react("➖")
                await message.react(mysticemoji);
                await message.react(instinctemoji);
                await message.react(valoremoji);
              })
              .catch(console.error);
          })
          .catch(console.error);
    })
    .catch(console.error);
}

async function updateRaiddd(message, id) {
  // extract information from the message
  newRaiddd = new Raid(message);

  // find object
  raid.findById(id)
    .then(result => {
      // update database
      result.update(newRaiddd.getDatabaseObject());

      // update message
      message.message.channel.messages.fetch(result.dataValues.messageid)
        .then(m => {
          // update embedded message with new information
          embed(m.embeds[0], newRaiddd, id)
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
  // let raidschannel = message.guild.channels.find("name", "raids");
  // if (pokemon.name == "Snorlax" || pokemon.name == "Machamp" || pokemon.name == "Tyranitar" || pokemon.name == "Lapras") {
  //   let role = message.guild.roles.find("name", pokemon.name);
  //   raidschannel.send(`Raid ${id}: ${role}`);
  // } else {
  //   raidschannel.send(`Raid ${id}: ${pokemon.name}`);
  // }
}

function defaultEmbed() {
  return new Discord.MessageEmbed()
    .setColor(0xffffff)
    .setURL(undefined)
    .setAuthor("Raid #-1: To be added")
    .setTitle("📍 to be added")
    .addField("End time", "to be added")
    .addField("Battle time", "to be determined")
    .addField("Joining (bring at least x trainers)", "No people interested yet");
}

async function embed(embed, raiddd, id) {
  Object.keys(raiddd).forEach((key) => {
    switch (key) {
      case "gym":
        embed.setURL(raiddd.gym.url);
        embed.setTitle("📍 " + raiddd.gym.name);
        break;
      case "pokemon":
        embed.setAuthor("Raid #" + id + ": " + raiddd.pokemon.name);
        embed.setThumbnail(`https://img.pokemondb.net/sprites/x-y/normal/${raiddd.pokemon.name.toLowerCase()}.png`);
        embed.fields.filter(field => /^Joining/.test(field.name))[0].name = "Joining (bring at least " + raiddd.pokemon.recplayers + " trainers)";
        break;
      case "endtime":
        embed.fields.filter(field => field.name === "End time")[0].value = raiddd.endtime;
        break;
      case "battletime":
        embed.fields.filter(field => field.name === "Battle time")[0].value = raiddd.battletime;
        break;
      case "team":
        embed.setColor(embedColor(raiddd));
    }
  });
  return embed;
}

/**
 * Determine the color of the embedded message.
 * @param {*} raiddd
 */
function embedColor(raiddd) {
  switch (raiddd.team) {
    case "mystic":
      return 0x0677ee;
    default:
      return 0xffffff;
  }
}

/**
 * Data class for raid object
 */
class Raid {
  constructor(message) {
    this.pokemon = extractPokemon(message);
    this.gym = extractGym(message);
    this.battletime = extractBattleTime(message);
    this.endtime = extractEndTime(message);
    this.team = extractTeam(message);
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
      }
    });
    return result;
  }
}

/**
 * Returns the team of the gym, otherwise null.
 * @param {Message} message The content of the message
 */
function extractTeam(message) {
  if (/mystic/.test(message.message.content)) {
    return "mystic";
  }
  if (/instinct/.test(message.message.content)) {
    return "instinct"
  }
  if (/valor/.test(message.message.content)) {
    return "valor"
  }
  return null;
}

/**
 * Extracts the end time from the message if present, returns null otherwise.
 * @param {Message} message The message
 */
function extractEndTime(message) {
  var regex = /e (\d\d:\d\d)/;
  return matchRegexReturnFirst(message.message.content, regex);
}

/**
 * Extracts the battle time from the message if present, returns null otherwise.
 * @param {Message} message The message
 */
function extractBattleTime(message) {
  var regex = /b (\d\d:\d\d)/;
  return matchRegexReturnFirst(message.message.content, regex);
}

/**
 * Extracts the gym from the message if present, returns null otherwise.
 * @param {*} message The message
 */
// TODO: Update to regex (is hard though)
function extractGym(message) {
  let textArray = message.message.content.split(" ");
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
function extractPokemon(message) {
  // old way of extracting the pokemon from the message
  // TODO: update to more efficient method
  let textArray = message.message.content.split(" ");
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

// TODO: update according to new raid system
function printHelp(message) {
  let embed = new Discord.MessageEmbed()
    .setAuthor("How to use the Raid Bot")
    .setColor(0xffffff)
    .addField("Add a Raid", "**!raid [boss] e [end time] g [gym] b [battle time]**")
    .addField("Required/Optional", "required: boss; optional: e,g,b.")
    .addField("Change Raid Parameters", "**!raid [raid ID] [e/g/b] [value]**")
    .addField("Raid ID", "The raid ID is the number in Blanches raid announcement.")
    .addField("Join/Leave a Raid", "**!raid join [id]** to join, **!raid leave [id]** to leave")
    .addField("Delete a Raid / Delete All Raids", "**!raid del [id]** / **!raid del all**")

  message.channel.send({ embed });
}

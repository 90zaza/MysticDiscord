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
      defaultValue: "ID"
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
    console.log('WHADDUPP')
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



async function updateMessage(msg, msgId, id, bossName, gymName, endTime, battleTime, joinedPlayers, isMystic) {

  let pokemon = pokemons.find((item) => {
    return item.keys.includes(bossName);
  });

  let imageURL = `https://img.pokemondb.net/sprites/x-y/normal/${pokemon.name.toLowerCase()}.png`;

  var joining = "no people interested yet";
  if (joinedPlayers && joinedPlayers.length > 0) {
    joining = joinedPlayers.join("\n");
  }

  const gym = gyms.find((gym) => {
    return gym.keys.find((key) => {
      return gymName.trim().toLowerCase().startsWith(key);
    });
  });

  // create message
  let embed = new Discord.RichEmbed()
    .setColor(isMystic ? 0x0677ee : 0xffffff)
    .setURL(gym ? gym.url : "")
    .setAuthor("Raid #" + id + ": " + (pokemon ? pokemon.name : BossName))
    .setTitle("📍 " + (gym ? gym.name : gymName))
    .setThumbnail(imageURL)
    .addField("Times", "Ends:\t" + endTime + "\nBattle:\t" + battleTime)
    .addField("Joining (bring at least " + pokemon.recplayers + " trainers)", joining);

  // find message to update in the channel
  let raidsmeldingenchannel = msg.guild.channels.find("name", "raids_meldingen");
  let message = raidsmeldingenchannel.messages.find("id", msgId);

  if (message) {
    // If the message exists, update it with the new embedded message that was created
    return message.edit({ embed });
  } else {
    var ret;
    // If the message object is null, this function is called with msgID = -1,
    // which means a new raid is registered. Notify the new raid in the raid channel.
    // TODO: clean up this hack of creating a new raid. (seperate creating of embed message, call from different functions)

    // Send message to raid channel with new raid
    let raidschannel = msg.guild.channels.find("name", "raids");
    if (pokemon.name == "Snorlax" || pokemon.name == "Machamp" || pokemon.name == "Tyranitar" || pokemon.name == "Lapras") {
      let role = msg.guild.roles.find("name", pokemon.name);
      raidschannel.send(`Raid ${id}: ${role}`);
    } else {
      raidschannel.send(`Raid ${id}: ${pokemon.name}`);
    }

    // TODO: Do not use timeouts when sending emojis
    raidsmeldingenchannel.send({ embed })
      .then(function (message) {
        ret = message;
        message.react("➕"),
          setTimeout(() => {
            message.react("➖")
          }, 500),
          setTimeout(() => {
            message.react(mysticemoji)
          }, 1000),
          setTimeout(() => {
            message.react(instinctemoji)
          }, 1500),
          setTimeout(() => {
            message.react(valoremoji)
          }, 2000)
      })
      .catch(console.error);
    return ret;
  }
}

async function updateRaid(msg) {

  let text = msg.content.toLowerCase();
  let textArray = text.split(" ");

  let raidId = textArray[0];

  if (isNaN(parseFloat(raidId))) {
    return;
  }

  var info = {};
  info.isMystic = isMysticcc(msg.content);

  indexes = [textArray.indexOf("e"), textArray.indexOf("b"), textArray.indexOf("g"), textArray.length].sort();
  let endIdx = textArray.indexOf("e");
  if (endIdx >= 0) {
    info.raidendtime = textArray.slice(endIdx + 1, indexes[indexes.indexOf(endIdx) + 1]).join(' ');
  }

  let battleIdx = textArray.indexOf("b");
  if (battleIdx >= 0) {
    info.raidbattletime = textArray.slice(battleIdx + 1, indexes[indexes.indexOf(battleIdx) + 1]).join(' ');
  }

  let gymIdx = textArray.indexOf("g");
  if (gymIdx >= 0) {
    info.raidgym = textArray.slice(gymIdx + 1, indexes[indexes.indexOf(gymIdx) + 1]).join(' ')
  }

  if (endIdx < 0 && battleIdx < 0 && gymIdx < 0 && isMystic < 0) {
    return;
  }

  await raid.update(info, {
    where: { "idraids": raidId }
  });

  let result = await raid.findOne({
    where: { "idraids": raidId }
  });

  if (result) {
    updateMessage(
      msg,
      result.dataValues.messageid,
      result.dataValues.idraids,
      result.dataValues.raidboss,
      result.dataValues.raidgym,
      result.dataValues.raidendtime,
      result.dataValues.raidbattletime,
      result.dataValues.joining,
      result.dataValues.isMystic
    );
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

// TODO: update according to new raid system
function printHelp(message) {
  let embed = new Discord.RichEmbed()
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

async function addRaid2(message) {
  try {
    // create raid object
    newRaiddd = new Raid(message);
    // add raid to db
    raid.create(newRaiddd)
      // send message of newly created raid with obtained id from the database
      .then(response => createMessage(newRaiddd, response.dataValues.idraids))
      .catch(console.error);
  }
  catch (error) {
    console.log(error);
  }

}

async function updateRaiddd(message, id) {
  try {
    // extract information from the message
    newRaiddd = new Raid(message);

    // update updated parts in database
    // aka remove properties that are null from object, update raid with that object
    // but we don't want to update
    Object.keys(newRaiddd).forEach((key) => (newRaiddd[key] == null) && delete newRaiddd[key]);
    console.log(newRaiddd);


    // 368144312300470272

    // // get raid with given id from database
    // raid.findAll({
    //   where: {
    //     idraids: id
    //   }
    // })
    // .then(oldRaiddd => console.log(oldRaiddd));

    // // update message
    // console.log(newRaiddd);
    // newRaiddd.clean()
    // console.log("cleaned " + JSON.stringify(newRaiddd));
  }
  catch (error) {
    console.log(error);
  }
}

// TODO: update
async function createMessage(raiddd, id) {
  const gym = gyms.find((gym) => {
    return gym.keys.find((key) => {
      return raiddd.raidgym.trim().toLowerCase().startsWith(key);
    });
  });

  const pokemon = pokemons.find((item) => {
    return item.keys.includes(raiddd.raidboss.toLowerCase());
  });
  const imageURL = `https://img.pokemondb.net/sprites/x-y/normal/${pokemon.name.toLowerCase()}.png`;

  // create message
  // TODO: Move to Raid class
  let embed = new Discord.RichEmbed()
    .setColor(raid.isMystic ? 0x0677ee : 0xffffff)
    .setURL(gym ? gym.url : "")
    .setAuthor("Raid #" + id + ": " + (pokemon ? pokemon.name : BossName))
    .setTitle("📍 " + (gym ? gym.name : raiddd.raidgym))
    .setThumbnail(imageURL)
    .addField("Times", "Ends:\t" + (raiddd.raidendtime ? raiddd.raidendtime : "to be added") + "\nBattle:\t" + (raiddd.raidbattletime ? raiddd.raidbattletime : "to be determined"))
    .addField("Joining (bring at least " + pokemon.recplayers + " trainers)", "No people interested yet");

  // Send message to raid channel with new raid
  let raidsmeldingenchannel = client.channels.find("name", "raids_meldingen");

  // TODO: Do not use timeouts when sending emojis
  raidsmeldingenchannel.send({ embed })
    .then(function (message) {
      ret = message;
      message.react("➕"),
        setTimeout(() => {
          message.react("➖")
        }, 500),
        setTimeout(() => {
          message.react(mysticemoji)
        }, 1000),
        setTimeout(() => {
          message.react(instinctemoji)
        }, 1500),
        setTimeout(() => {
          message.react(valoremoji)
        }, 2000)
    })
    .catch(console.error);

  // Send message to raid channel with new raid
  let raidschannel = raiddd.message.message.guild.channels.find("name", "raids");
  if (pokemon.name == "Snorlax" || pokemon.name == "Machamp" || pokemon.name == "Tyranitar" || pokemon.name == "Lapras") {
    let role = raiddd.message.message.guild.roles.find("name", pokemon.name);
    raidschannel.send(`Raid ${id}: ${role}`);
  } else {
    raidschannel.send(`Raid ${id}: ${pokemon.name}`);
  }
}

/**
 * Returns true if the message contains 'mystic'.
 * @param {Message} message The content of the message
 */
// TODO: extend to extract every colour
function isMysticcc(message) {
  var regex = /mystic/;
  return regex.test(message.message.content);
}
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
  if (gymIdx >= 0) {
    return textArray.slice(gymIdx + 1, indexes[indexes.indexOf(gymIdx) + 1]).join(' ');
  }
  return null;

  // Stuff to regex the gym name
  // var regex = /g\s([a-z| ]*)\s[b|e|\n]/;
  // return matchRegex(message.content, regex);
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
 * Extract just the name of the pokemon, required for db synchronisation
 * @param {*} message
 */
function extractPokemonName(message) {
  let pokemon = extractPokemon(message);
  if (pokemon) {
    return pokemon.name;
  }
  return null;
}

/**
 * Data class for raid object
 */
class Raid {
  constructor(message) {
    // raidboss is this way due to synchronization with db
    this.raidboss = extractPokemonName(message);
    this.raidgym = extractGym(message);
    this.raidbattletime = extractBattleTime(message);
    this.raidendtime = extractEndTime(message);
    this.isMystic = isMysticcc(message);
    this.team = extractTeam(message);
    // no clue what this is for, but this is from the old raid system
    // this.expireat = moment().add(2, 'hours');
    // TODO: this can't be included within this class due to database synchronization
    this.messageid = message.message.id;
    this.message = message;
  }

  /**
   * Merge all properties from other raid to this raid, besides teh messageid
   * @param {*} raid
   */
  merge(otherraid) {
    if (otherraid === Raid) {
      for (property in otherraid) {
        if (property != "messageid") {
          this.property = otherraid.property;
        }
      }
    }
  }

  clean() {
    Object.keys(this).forEach((key) => (this[key] == null) && delete this[key]);
  }
}


function embedColor(raiddd) {
  switch (raiddd.team) {
    case "mystic":
      return 0x0677ee;
    default:
      return 0xffffff;
  }
}

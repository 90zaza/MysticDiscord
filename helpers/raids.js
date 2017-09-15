const Discord = require('discord.js');
const Sequelize = require('sequelize');
const moment = require('moment');
const Message = require('../models/message');
const pokemons = require('../data/pokemons.json');
const gyms = require('../data/gyms.json');

var connection;
var raid;

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
    joining: {
      type: Sequelize.TEXT
    },
    messageid: {
      type: Sequelize.STRING,
      defaultValue: "ID"
    },
    expireat: {
      type: Sequelize.DATE
    },
    isMystic: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  });

  await raid.sync({
    // force: true
  });
}

exports.scan = async function (msg) {

  let text = msg.content.toLowerCase().substr(1).trim();
  let textArray = text.split(" ");

  if (textArray.length < 2) {
    printHelp(msg);
    return false;
  }

  let command = textArray[1];

  if (command === "help") {
    printHelp(msg);

  } else if(command === "del" && textArray.length > 2) {

    if (textArray[2] === "all") {
      await deleteRaid(msg);
    } else {
      deleteRaid(msg, textArray[2]);
    }
    return true;

  } else if(command === "join" && textArray.length > 2) {

    joinRaid(msg, textArray[2]);
    return true;

  } else if(command === "leave" && textArray.length > 2) {

    leaveRaid(msg, textArray[2]);
    return true;

  } else if(command === "resetid") {
    await raid.truncate();
    return true;

  } else {

    let boss = pokemons.find((item) => {
      return item.keys.includes(textArray[1]);
    });
    if (boss) {
      addRaid(msg, boss);
    } else {
      updateRaid(msg);
    }
  }

  return false;

  let update = false;
  let info = {};
}

function printHelp (msg) {

  let embed = new Discord.RichEmbed()
    .setAuthor("How to use the Raid Bot")
    .setColor(0xffffff)
    .addField("Add a Raid", "**!raid [boss] e [end time] g [gym] b [battle time]**")
    .addField("Required/Optional", "required: boss; optional: e,g,b.")
    .addField("Change Raid Parameters", "**!raid [raid ID] [e/g/b] [value]**")
    .addField("Raid ID", "The raid ID is the number in Blanches raid announcement.")
    .addField("Join/Leave a Raid", "**!raid join [id]** to join, **!raid leave [id]** to leave")
    .addField("Delete a Raid / Delete All Raids", "**!raid del [id]** / **!raid del all**")
    .addField("Add the word mystic or :mystic: anywhere to indicate the gym is controlled by our team");

    msg.channel.send({embed});
}

function updateMessage (msg, msgId, id, bossName, gymName, endTime, battleTime, joinedPlayers, isMystic) {

  let pokemon = pokemons.find((item) => {
    return item.keys.includes(bossName);
  });

  let imageURL = `https://img.pokemondb.net/sprites/x-y/normal/${pokemon.name.toLowerCase()}.png`;

  var joining = "no people interested yet";
  if (joinedPlayers && joinedPlayers.length > 0){
    joining = joinedPlayers.join("\n");
  }

  const gym = gyms.find( (gym) => {
    return gym.keys.find( (key) => {
      return gymName.trim().toLowerCase().startsWith(key);
    });
  });

  let embed = new Discord.RichEmbed()
    .setColor(isMystic ? 0x0677ee : 0xffffff)
    .setURL(gym ? gym.url : "")
    .setAuthor("Raid #" + id + ": " + (pokemon ? pokemon.name : BossName))
    .setTitle("📍 " + (gym ? gym.name : gymName) + (isMystic ? " (:mystic: Gym)" : "") )
    .setThumbnail(imageURL)
    .addField("Times", "Ends:\t" + endTime + "\nBattle:\t" + battleTime )
    .addField("Joining (bring at least " + pokemon.recplayers + " trainers)", joining);

  let channel = msg.guild.channels.find("name", "raids_meldingen");
  let message = channel.messages.find("id", msgId);

//reply message of the raid ID and role
  if (message) {} else {
    if (pokemon.name == "Snorlax" || pokemon.name == "Machamp" || pokemon.name == "Tyranitar" || pokemon.name == "Lapras") {
      let role = msg.guild.roles.find("name", pokemon.name);
      msg.channel.send(`Raid ${id}: ${role}`);
    } else {
      msg.channel.send(`Raid ${id}: ${pokemon.name}`);
    }
  }
  if (message) {
    return message.edit({embed});
  } else {
    return channel.send({embed});
    }
}

async function addRaid (msg, boss) {
  let text = msg.content.toLowerCase().substr(1);
  let textArray = text.split(" ");

  // check if array contains the word mystic
  let isMystic = textArray.indexOf("mystic");
  if (isMystic < 0) {
    // or the mystic icon
    isMystic = textArray.indexOf(":mystic:");
  }
  if (isMystic >= 0) { // if yes
    // remove the element from the array
    textArray.splice(isMystic, 1);
  }
  // if gym is blue this is > 0 otherwise 0
  ++isMystic;

  let info = { "raidboss": boss.keys[0] };

  indexes = [textArray.indexOf("e"), textArray.indexOf("b"),textArray.indexOf("g"), textArray.length].sort();
  let endIdx = textArray.indexOf("e");
  if (endIdx >= 0) {
    info.raidendtime = textArray.slice(endIdx+1,indexes[indexes.indexOf(endIdx)+1]).join(' ');
  }

  let battleIdx = textArray.indexOf("b");
  if (battleIdx >= 0) {
    info.raidbattletime =  textArray.slice(battleIdx+1,indexes[indexes.indexOf(battleIdx)+1]).join(' ');
  }

  let gymIdx = textArray.indexOf("g");
  if (gymIdx >= 0) {
    info.raidgym = textArray.slice(gymIdx+1, indexes[indexes.indexOf(gymIdx)+1]).join(' ');
  }

  info.expireat = moment().add(2, 'hours');

  info.isMystic = isMystic > 0;

  raid.create(info)
    .then(function(x) {

      let raidId = x.idraids;

      updateMessage (
        msg,
        -1,
        raidId,
        boss.keys[0],
        x.raidgym,
        x.raidendtime,
        x.raidbattletime,
        [],
        x.isMystic
      ).then( function(x) {

        var messageinfo = {"messageid": x.id}
        raid.update(messageinfo, {where: {"idraids":raidId} } );
      });
    });


  let raidsNeedToBeDeleted = await raid.findAll(
    {
      where: {
        expireat: {
          $lt: new Date()
        }
      }
    }
  );



  for (let raid in raidsNeedToBeDeleted) {
    msg.guild.channels.find("name", "raids_meldingen").messages.find("id", raid.dataValues.messageid).delete();
  }

}

async function updateRaid(msg) {

  let text = msg.content.toLowerCase().substr(1);
  let textArray = text.split(" ");

  let raidId = textArray[1];

  if (isNaN(parseFloat(raidId))) {
    return;
  }

  var info = {};

  // check if array contains the word mystic
  let isMystic = textArray.indexOf("mystic");
  if (isMystic < 0) {
    // or the mystic icon
    isMystic = textArray.indexOf(":mystic:");
  }
  if (isMystic >= 0) { // if yes
    // remove the element from the array
    textArray.splice(isMystic, 1);
    info.isMystic = true;
  }

  indexes = [textArray.indexOf("e"), textArray.indexOf("b"),textArray.indexOf("g"), textArray.length].sort();
  let endIdx = textArray.indexOf("e");
  if (endIdx >= 0) {
    info.raidendtime = textArray.slice(endIdx+1,indexes[indexes.indexOf(endIdx)+1]).join(' ');
  }

  let battleIdx = textArray.indexOf("b");
  if (battleIdx >= 0) {
    info.raidbattletime =  textArray.slice(battleIdx+1,indexes[indexes.indexOf(battleIdx)+1]).join(' ');
  }

  let gymIdx = textArray.indexOf("g");
  if (gymIdx >= 0) {
    info.raidgym = textArray.slice(gymIdx+1, indexes[indexes.indexOf(gymIdx)+1]).join(' ')
  }

  if(endIdx < 0 && battleIdx < 0 && gymIdx < 0 && isMystic < 0) {
    return;
  }

  await raid.update (info, {
    where: {"idraids": raidId}
  });

  let result = await raid.findOne({
    where: {"idraids": raidId}
  });

  if(result) {
    updateMessage (
      msg,
      result.dataValues.messageid,
      result.dataValues.idraids,
      result.dataValues.raidboss,
      result.dataValues.raidgym,
      result.dataValues.raidendtime,
      result.dataValues.raidbattletime,
      JSON.parse(result.dataValues.joining),
      result.dataValues.isMystic
    );
  }

}

async function deleteRaid (msg, id) {

  if (!isNaN(id)) {

    try {
      result = await raid.findOne({
        where: {"idraids": id}
      })
      msg.guild.channels.find("name", "raids_meldingen").messages.find("id",result.dataValues["messageid"]).delete()

      await raid.destroy({
        where: {
          "idraids": id
        }
      })
    } catch (error) {
      // do nothing
    }

  } else {

    raid.findAll({where:{}}).then(function(x){
      for (i = 0; i < x.length; i++){
        let channel = msg.guild.channels.find("name", "raids_meldingen");
        let message = channel.messages.find("id",x[i]["messageid"]);
        if (message) {
          message.delete();
        }
      }
    }).then(function() {
      raid.destroy({
        where: {}
      });
    });
  }
}

function joinRaid (msg, id) {

  raid.findOne ( {where: {"idraids": id} } )
    .then (function (dbRaid) {

      let join = dbRaid.dataValues.joining
      if (!join) {
        join = [];
      } else {
        join = JSON.parse(join);
      }
      let author = msg.author.lastMessage.member.nickname;
      if (author == null){
        author = msg.author.username
      }
      if (join.indexOf(author) < 0) {
        join.push(author)
      }

      raid.update ( {"joining": JSON.stringify(join)}, {
       where: {"idraids": id},
       returning: true
      })
      .then (async function (result) {

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

function leaveRaid (msg, id) {

  raid.findOne ( {where: {"idraids": id} } )
    .then (function (dbRaid) {
      let author = msg.author.lastMessage.member.nickname;
      let join = JSON.parse(dbRaid.dataValues.joining);
      if (author == null){
        author = msg.author.username
      }
      if (join.indexOf(author) >= 0) {
        join.splice (join.indexOf(author), 1);
      }

      raid.update ( {"joining": JSON.stringify(join)}, {
        where: {"idraids": id}
      })
      .then (async function (result) {

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

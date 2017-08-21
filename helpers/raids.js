const Discord = require('discord.js');
const Sequelize = require('sequelize');

const Pokemon = require('./pokemon.js');
const Gym = require('./gym.js');

var connection;
var raid;

exports.init = function () {

  connection = new Sequelize('d4nplae62mj8j7', 'imiosejcivqljb',
    'bdf834eba171721c921d94fa6d173ad7719a04d6477588e4d18d53b8c1eeaab5', {
      host: 'ec2-23-23-221-255.compute-1.amazonaws.com',
      port: 5432,
      dialect: 'postgres',
      dialectOptions: {
        "ssl": {
          "require": true
        }
      },
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
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue : []
    },
    messageid: {
      type: Sequelize.STRING,
      defaultValue: "ID"
    },
    expireat: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("now() + '2 hours'::interval")
    }
  });
}

exports.scan = function (msg) {

  let text = msg.content.toLowerCase().substr(1);
  let textArray = text.split(" ");

  if (textArray.length < 2) {
    printHelp(msg);
    return false;
  }

  let command = textArray[1];

  if (command == "help") {
    printHelp(msg);

  } else if(command == "del" && textArray.length > 2) {

    (textArray[2] == "all") ? deleteRaid(msg) : deleteRaid(msg, textArray[2]);
    return true;

  } else if(command == "join" && textArray.length > 2) {

    joinRaid(msg, textArray[2]);
    return true;

  } else if(command == "leave" && textArray.length > 2) {

    leaveRaid(msg, textArray[2]);
    return true;

  } else if(command == "resetid") {

    connection.query("ALTER SEQUENCE raids_idraids_seq RESTART 1");
    return true;

  } else {

    let boss = Pokemon.checkForPokemon(textArray[1]);
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
    .addField("Delete a Raid / Delete All Raids", "**!raid del [id]** / **!raid del all**");

    msg.channel.send({embed});
}

function updateMessage (msg, msgId, id, bossName, gymName, endTime, battleTime, joinedPlayers) {

  let pokemon = Pokemon.checkForPokemon(bossName);

  let imageURL = "";
  if (pokemon) {
    let leadingZeroes = "";
    if (pokemon.number < 100 )
    {
      leadingZeroes = pokemon.number < 10 ? "00" : "0";
    }
    imageURL = "https://assets.pokemon.com/assets/cms2/img/pokedex/full/" + leadingZeroes + pokemon.number + ".png";
  }

  let gym = Gym.checkForGym(gymName);
  let embed = new Discord.RichEmbed()
    .setColor(0xffffff)
    .setURL(gym ? gym.url : "")
    .setAuthor("Raid #" + id + ": " + (pokemon ? pokemon.name : bossName))
    .setTitle("📍 " + (gym ? gym.name : gymName))
    .setThumbnail(imageURL)
    .addField("Times", "Ends:\t" + endTime + "\nFight:\t" + battleTime )
    .addField("Joining (bring at least " + pokemon.recplayers + " trainers)", joinedPlayers);

  let channel = msg.guild.channels.find("name", "raids_meldingen");
  let message = channel.messages.find("id", msgId);
  if (message) {
    return message.edit({embed});
  } else {
    return channel.send({embed});
  }
}

function addRaid (msg, boss) {

  let text = msg.content.toLowerCase().substr(1);
  let textArray = text.split(" ");

  let info = { "raidboss": boss.keys[0] };

  let endIdx = textArray.indexOf("e");
  if (endIdx >= 0) {
    info.raidendtime = textArray[endIdx+ 1];
  }

  let battleIdx = textArray.indexOf("b");
  if (battleIdx >= 0) {
    info.raidbattletime = textArray[battleIdx+ 1];
  }

  let gymIdx = textArray.indexOf("g");
  if (gymIdx >= 0) {
    info.raidgym = textArray.slice(gymIdx+1, textArray.length).join(' ');
  }

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
        "no people interested yet"
      ).then( function(x) {

        var messageinfo = {"messageid": x.id}
        raid.update(messageinfo, {where: {"idraids":raidId} } );
      });
    });

  connection.query("DELETE FROM raids WHERE expireat < NOW() RETURNING *").then(function(x){
    for (i = 0 ; i < x[0].length ; i++){
      msg.guild.channels.find("name", "raids_meldingen").messages.find("id",x[0][i]["messageid"]).delete();
    }
  });
}

async function updateRaid(msg) {

  let text = msg.content.toLowerCase().substr(1);
  let textArray = text.split(" ");

  let raidId = textArray[1];

  if (isNaN(parseFloat(raidId))) {
    return;
  }

  var info = {};

  let endIdx = textArray.indexOf("e");
  if (endIdx >= 0) {
    info.raidendtime = textArray[endIdx+ 1];
  }

  let battleIdx = textArray.indexOf("b");
  if (battleIdx >= 0) {
    info.raidbattletime = textArray[battleIdx+ 1];
  }

  let gymIdx = textArray.indexOf("g");
  if (gymIdx >= 0) {
    info.raidgym = textArray.slice(gymIdx+1, textArray.length).join(' ');
  }

  if(endIdx < 0 && battleIdx < 0 && gymIdx < 0) {
    return;
  }

  await raid.update (info, {
    where: {"idraids": raidId}
  });

  raid.findOne({
    where: {"idraids": raidId}
  }).then(function(x) {

    var joining = null
    if (x["joining"].length > 0){
      joining = x["joining"].join(', ')
    }else{
      joining = "no people interested yet"
    }

    updateMessage (
      msg,
      x.messageid,
      x.idraids,
      x.raidboss,
      x.raidgym,
      x.raidendtime,
      x.raidbattletime,
      joining
    )
  });
}

function deleteRaid (msg, id) {

  if (!isNaN(id)) {

    raid.findOne({
      where: {"idraids": id}
    })
    .then(function(x){
      msg.guild.channels.find("name", "raids_meldingen").messages.find("id",x["messageid"]).delete()
    });
    raid.destroy({
      where: {
        "idraids": id
      }
    })

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
      if (join.indexOf("<@"+msg.author.id+">") < 0) {
        join.push("<@"+msg.author.id+">")
      }

      raid.update ( {"joining": join}, {
       where: {"idraids": id},
       returning: true
      })
      .then (function (dbRaid) {

        var joining = null;
        if (dbRaid[1][0].dataValues.joining.length > 0){
          joining = dbRaid[1][0].dataValues.joining.join('\n')
        } else {
          joining = "no people interested yet."
        }

        updateMessage(
          msg,
          dbRaid[1][0].dataValues.messageid,
          dbRaid[1][0].dataValues.idraids,
          dbRaid[1][0].dataValues.raidboss,
          dbRaid[1][0].dataValues.raidgym,
          dbRaid[1][0].dataValues.raidendtime,
          dbRaid[1][0].dataValues.raidbattletime,
          joining
        )
     })
    });
}

function leaveRaid (msg, id) {

  raid.findOne ( {where: {"idraids": id} } )
    .then (function (dbRaid) {

      let join = dbRaid.dataValues.joining
      if (join.indexOf("<@"+msg.author.id+">") >= 0) {
        join.splice (join.indexOf("<@"+msg.author.id+">"), 1);
      }

      raid.update ( {"joining": join}, {
        where: {"idraids": id},
        returning: true
      })
      .then (function (dbRaid) {

        var joining = null;
        if (dbRaid[1][0].dataValues.joining.length > 0){
          joining = dbRaid[1][0].dataValues.joining.join('\n')
        } else {
          joining = "no people interested yet."
        }

        updateMessage(
          msg,
          dbRaid[1][0].dataValues.messageid,
          dbRaid[1][0].dataValues.idraids,
          dbRaid[1][0].dataValues.raidboss,
          dbRaid[1][0].dataValues.raidgym,
          dbRaid[1][0].dataValues.raidendtime,
          dbRaid[1][0].dataValues.raidbattletime,
          joining
        )
     })
    });
}

const Discord = require('discord.js');
const Sequelize = require('sequelize');
const moment = require('moment');
const Message = require('../models/message');
const pokemons = require('../data/pokemons.json');
const gyms = require('../data/gyms.json');

var connection;
var raid;

//testdiscord
const joinemoji   = '➕';
const leaveemoji   = '➖';
const mysticemoji   = '361948063071338497';
const instinctemoji = '361948063423791105';
const valoremoji    = '361948063360745474';

//production
//const mysticemoji   = `340033299521077248`
//const instinctemoji = `340033299508363265`
//const valoremoji    = `340141649474617346`

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

exports.scan = async function (msg) {

  let text = msg.content.toLowerCase().trim();
  let textArray = text.split(" ");

  let command = textArray[0];

    if(command === "del") {

      if (textArray[1] === "all") {
        //delete raids
        await deleteRaid(msg);
        //resetID command
        setTimeout(() => {
          raid.truncate();
          return true;
        }, 500);
        let raidschannel = msg.guild.channels.find("name", "raids");
        raidschannel.send("raids removed & raidID reset");

      } else {
        if (textArray.length > 1){
          deleteRaid(msg, textArray[1]);
        }
      }
      return true;

  } else if(command === "resetid") {
    await raid.truncate();
    return true;

  } else {

    let boss = pokemons.find((item) => {
      return item.keys.includes(textArray[0]);
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


exports.scanReaction = async function (messageReaction, user) {

  let title = messageReaction.message.embeds[0].author.name;
  let id = title.split(" ")[1][1];

  messageReaction.remove(user);

  if(messageReaction.emoji == joinemoji) {
  //action for one extra player joining

    console.log("join " + id);
    joinRaid(messageReaction.message, user, id);

  }

  if(messageReaction.emoji == leaveemoji) {
  //action for one less player joining

        console.log("leave")
  }

  if(messageReaction.emoji == mysticemoji) {
  //make raid blue

        console.log("blue")
  }

  if(messageReaction.emoji == valoremoji) {
  //make raid red

        console.log("red")
  }

  if(messageReaction.emoji == instinctemoji) {
  //make raid yellow

        console.log("yellow")
  }
}



async function updateMessage (msg, msgId, id, bossName, gymName, endTime, battleTime, joinedPlayers, isMystic) {

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
    .setTitle("📍 " + (gym ? gym.name : gymName))
    .setThumbnail(imageURL)
    .addField("Times", "Ends:\t" + endTime + "\nBattle:\t" + battleTime )
    .addField("Joining (bring at least " + pokemon.recplayers + " trainers)", joining);

  let raidsmeldingenchannel = msg.guild.channels.find("name", "raids_meldingen");
  let message = raidsmeldingenchannel.messages.find("id", msgId);

//reply message of the raid ID and role
  if (message) {} else {
    let raidschannel = msg.guild.channels.find("name", "raids");
    if (pokemon.name == "Snorlax" || pokemon.name == "Machamp" || pokemon.name == "Tyranitar" || pokemon.name == "Lapras") {
      let role = msg.guild.roles.find("name", pokemon.name);
      raidschannel.send(`Raid ${id}: ${role}`);
    } else {
      raidschannel.send(`Raid ${id}: ${pokemon.name}`);
    }
  }
  if (message) {
    return message.edit({embed});
  } else {
    let newMessage = raidsmeldingenchannel.send({embed}).then(function (message) {
          message.react("➕")
          setTimeout(() => {
            message.react("➖")
          }, 500);
          setTimeout(() => {
            message.react(mysticemoji)
          }, 1000);
          setTimeout(() => {
            message.react(instinctemoji)
          }, 1500);
          setTimeout(() => {
            message.react(valoremoji)
          }, 2000);})

      return newMessage;

  }
}

async function addRaid (msg, boss) {

  let text = msg.content.toLowerCase();
  let textArray = text.split(" ");

  // check if array contains the word mystic
  let isMystic = textArray.indexOf("mystic") + textArray.indexOf(mysticemoji);
  if (isMystic >= 0) { // if yes
    // remove the element from the array
    textArray.splice(isMystic, 0);
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
              console.log("++++++++++++   1    +++++++++++");

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
                console.log(x);
                setTimeout(() => {
                  var messageinfo = {"messageid": x.id};
                }, 2500);

          console.log("++++++++++++   " + messageinfo + "    +++++++++++");
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
    let raidsmeldingenchannel = msg.guild.channels.find("name", "raids_meldingen");
    raidsmeldingenchannel.messages.find("id", raid.dataValues.messageid).delete();
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

  // check if array contains the word mystic
  let isMystic = textArray.indexOf("mystic") + textArray.indexOf(mysticemoji);
  if (isMystic >= 0) { // if yes
    // remove the element from the array
    textArray.splice(isMystic, 0);
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
      result.dataValues.joining,
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
      let raidsmeldingenchannel = msg.guild.channels.find("name", "raids_meldingen");
      raidsmeldingenchannel.messages.find("id",result.dataValues["messageid"]).delete()

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
        let raidsmeldingenchannel = msg.guild.channels.find("name", "raids_meldingen");
        let message = raidsmeldingenchannel.messages.find("id",x[i]["messageid"]);
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

function joinRaid (msg, user, id) {

  console.log(msg);
  raid.findOne ( {where: {"messageid": msg.id} } )
    .then (function (dbRaid) {

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
      if (author == null){
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
      for( var i = 0; i < joining.length; i++ )
      {
        combinedJoin[i] = joining[i];
        if(joiningAdditions[i] > 0)
        {
          combinedJoin[i] += " + " + joiningAdditions[i];
        }
      }

      raid.update ( {"joining": joining.join("; "), "joiningAdditions": joiningAdditions.join("; ") },{
       where: {"messageid": msg.id},
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
          combinedJoin,
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

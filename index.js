'use strict';


const Sequelize = require('sequelize');

require('dotenv').config()

console.log(process.env.TOKEN);


var Discord = require('discord.js');
var client = new Discord.Client();
var https = require("https");
const Message = require("./models/message")
const settings = require("./settings.json")
const gyms = require('./data/gyms.json');
const stops = require('./data/pokestops.json');
const pokemons = require('./data/pokemons.json');
const defense = require('./data/defense.json');
const messages = require('./data/messages.json');

client.login(process.env.TOKEN);


var express = require('express');
var app = express();

const pokemonStats = require('./helpers/pokemon.js');
pokemonStats.calculateRanks();

app.set('port', (process.env.PORT || 9222));

app.use(express.static(__dirname + '/public'));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));

  setInterval(function() {
    https.get("https://discord-pokemon.herokuapp.com/helloworld.html");
  }, 300000); // every 5 minutes (300000)
});

client.on('ready', () => {
  client.user.setGame('Pokemon Go');
  console.log('Blanche: I am ready!');
});

const connection = new Sequelize('d4nplae62mj8j7', 'imiosejcivqljb',
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


const raid = connection.define('raid', {
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
})



client.on("message", async (msg) => {
  //console.log(msg)
  let prefixs = settings.prefixs;

  let moderator = settings.moderator;

  // get the first character of the message content
  let msgPrefix = msg.content[0];
  // get the message content, cut the first character, convert it to all lowercase and save to new variable
  var msgText = msg.content.toLowerCase().substr(1);
  var pokemon;

  if (prefixs.indexOf(msgPrefix) < 0 || msg.author.bot) return;


  if (msgText.split(' ')[0] == 'raid') {
    var update = false
    var info = {}
    var splits = msg.content.split(' ');
    var second = splits[1];
    if (isNaN(second)) {
      if (second == "del") {
        var third = splits[2]
        if (third == "all") {
          raid.findAll({where:{}}).then(function(x){
            for (i = 0; i < x.length; i++){
              msg.guild.channels.find("name", "raids_meldingen").messages.find("id",x[i]["messageid"]).delete()
            }
          })
          raid.destroy({
            where: {}
          })
        } else {
          raid.findOne({
            where: {"idraids": third}
          }).then(function(x){
              msg.guild.channels.find("name", "raids_meldingen").messages.find("id",x["messageid"]).delete()
            })
          raid.destroy({
            where: {
              "idraids": third
            }
          })
        }
      }else if(second == 'help'){
        msg.channel.send({
          embed: {
            color: 3447003,
            fields: [{
              name: "add a raid",
              value: "!raid [boss] e [end time] g [gym] b [battle time]"
            },{
              name: "required/optional",
              value: "required: boss; optional: e,g,b"
            },{
               name: "change raid parameters",
              value: "!raid [raid id] [e/g/b] [value]"
            },{
              name: "raid id",
              value: "raid id can be found in message from Blanche"
            },
            { name: "join/leave a raid",
              value: "!raid join [id] to join, !raid leave [id] to leave"
            },{
              name: "delete a raid / delete all raids",
              value: "!raid del [id] / !raid del all"
            }
            ]
          }})
      }else if(second == 'join'){
        var id = splits[2]
        raid.findOne({where:{"idraids": id}

        }).then(function(x){
          var join = x["dataValues"]["joining"]
          if (join.indexOf("<@"+msg["author"]["id"]+">") < 0){
            join.push("<@"+msg["author"]["id"]+">")
          }
           raid.update({"joining": join}, {
            where: {
              "idraids": id
            },returning: true
          }).then(function(x){
        const gymMatch = gyms.find((gym) => {
            if (!gym.keys) {
                console.log('gym has no key', gym);
                return;
              }

             return gym.keys.find((key) => {
                return x[1][0]["dataValues"]["raidgym"].startsWith(key);
              });
            });

            if (gymMatch) {
              var gym = gymMatch.name;
            }else{
              gym = x[1][0]["dataValues"]["raidgym"]
            }

            var joining = null
            if (x[1][0]["dataValues"]["joining"].length > 0){
              joining = x[1][0]["dataValues"]["joining"].join(', ')
            }else{
              joining = "no people interested yet"
            }

        msg.guild.channels.find("name", "raids_meldingen").messages.find("id",x[1][0]["dataValues"]["messageid"]).edit({
          embed: {
            color: 3447003,
            fields: [{
                name: "raid ",
                value: "raid #" + x[1][0]["dataValues"]["idraids"] + " " + x[1][0]["dataValues"][
                  "raidboss"] + " tot " + x[1][0]["dataValues"]["raidendtime"]
            },
              {
                name: "gym",
                value: gym
              },
              {
                name: "raid battle time",
                value: x[1][0]["dataValues"]["raidbattletime"]
              },
              {
                name: "joining",
                value: joining
              }
            ]
          }
        })
          })
        })
      }else if(second == 'leave'){
        var id = splits[2]
        raid.findOne({where:{"idraids": id}

        }).then(function(x){
          var join = x["dataValues"]["joining"]
          if (join.indexOf("<@"+msg["author"]["id"]+">") >= 0){
            var idj = join.indexOf("<@"+msg["author"]["id"]+">")
            join.splice(idj,1)
          }
           raid.update({"joining": join}, {
            where: {
              "idraids": id
            },returning: true
          }).then(function(x){
        const gymMatch = gyms.find((gym) => {
            if (!gym.keys) {
                console.log('gym has no key', gym);
                return;
              }

             return gym.keys.find((key) => {
                return x[1][0]["dataValues"]["raidgym"].startsWith(key);
              });
            });

            if (gymMatch) {
              var gym = gymMatch.name;
            }else{
              gym = x[1][0]["dataValues"]["raidgym"]
            }

            var joining = null
            if (x[1][0]["dataValues"]["joining"].length > 0){
              joining = x[1][0]["dataValues"]["joining"].join(', ')
            }else{
              joining = "no people interested yet"
            }

        msg.guild.channels.find("name", "raids_meldingen").messages.find("id",x[1][0]["dataValues"]["messageid"]).edit({
          embed: {
            color: 3447003,
            fields: [{
                name: "raid #" + x[1][0]["dataValues"]["idraids"],
                value: x[1][0]["dataValues"]["raidboss"] + " tot " + x[1][0]["dataValues"]["raidendtime"]
            },
              {
                name: "gym",
                value: gym
              },
              {
                name: "raid battle time",
                value: x[1][0]["dataValues"]["raidbattletime"]
              },
              {
                name: "joining",
                value: joining
              }
            ]
          }
        })
          })
        })
      }else if (second == "resetid"){
        connection.query("ALTER SEQUENCE raids_idraids_seq RESTART 1")
      }else {
        info = {
          "raidboss": second
        }
        i = 2
        while (splits[i] != null) {
          var index = [splits.indexOf('e'),splits.indexOf('b'),splits.indexOf('g'),splits.length].sort()

          if (splits[i] == 'e') {
            info["raidendtime"] = splits[i + 1];
            i += 1;
          } else if (splits[i] == 'b') {
            info["raidbattletime"] = splits[i + 1];
            i += 1;
          } else if (splits[i] == 'g') {
            var id = index.indexOf(splits.indexOf('g'))
            info["raidgym"] = splits.slice(index[id]+1,index[id+1]).join(' ');
            i += 1;
          } else {
            i += 1;
          }
        }
        raid.create(info).then(function(x) {
            var id = x.idraids;

            const gymMatch = gyms.find((gym) => {
            if (!gym.keys) {
                console.log('gym has no key', gym);
                return;
              }

             return gym.keys.find((key) => {
                return x["raidgym"].startsWith(key);
              });
            });
            var gym
            if (gymMatch) {
              gym = gymMatch.name;
            }else{
              gym = x["raidgym"]
            }
            var joining = null
            if (x["joining"].length > 0){
              joining = x["joining"].join(', ')
            }else{
              joining = "no people interested yet"
            }

            msg.guild.channels.find("name", "raids_meldingen").send({
              embed: {
                color: 3447003,
                fields: [{
                    name: "raid ",
                    value: "raid #" + x["idraids"] + " " + x[
                      "raidboss"] + " tot " + x["raidendtime"]
              },
                  {
                    name: "gym",
                    value: gym
                },
                  {
                    name: "raid battle time",
                    value: x["raidbattletime"]
                },{
                  name: "joining",
                  value: joining
                }
              ]
              }
            }).then(function(x){
              var messageinfo = {"messageid": x.id}
              raid.update(messageinfo,{where:{"idraids":id}})
            })
          })
          connection.query("DELETE FROM raids WHERE expireat < NOW() RETURNING *").then(function(x){
            for (i = 0 ; i < x[0].length ; i++){
              console.log(x[0][i]["messageid"])
              msg.guild.channels.find("name", "raids_meldingen").messages.find("id",x[0][i]["messageid"]).delete()
          }

          })
      }
    } else {
      i = 2
      while (splits[i] != null) {
        var index = [splits.indexOf('e'),splits.indexOf('b'),splits.indexOf('g'),splits.length].sort()
        if (splits[i] == 'e') {
          info["raidendtime"] = splits[i + 1];
          i += 1;
        } else if (splits[i] == 'b') {
          info["raidbattletime"] = splits[i + 1];
          i += 1;
        } else if (splits[i] == 'g') {
          var id = index.indexOf(splits.indexOf('g'))
          info["raidgym"] = splits.slice(index[id]+1,index[id+1]).join(' ');
          i += 1;
        } else {
          i += 1;
        }
      }

       await raid.update(info, {
        where: {
          "idraids": second
        }
      });

      raid.findOne({
        where: {
          "idraids": second
        }
      }).then(function(x) {
        x["messageid"]
        const gymMatch = gyms.find((gym) => {
            if (!gym.keys) {
                console.log('gym has no key', gym);
                return;
              }

             return gym.keys.find((key) => {
                return x["raidgym"].startsWith(key);
              });
            });

            if (gymMatch) {
              var gym = gymMatch.name;
            }else{
              gym = x["raidgym"]
            }

            var joining = null
            if (x["joining"].length > 0){
              joining = x["joining"].join(', ')
            }else{
              joining = "no people interested yet"
            }

        msg.guild.channels.find("name", "raids_meldingen").messages.find("id",x["messageid"]).edit({
          embed: {
            color: 3447003,
            fields: [{
                name: "raid ",
                value: "raid #" + x["idraids"] + " " + x[
                  "raidboss"] + " tot " + x["raidendtime"]
            },
              {
                name: "gym",
                value: gym
              },
              {
                name: "raid battle time",
                value: x["raidbattletime"]
              },
              {
                name: "joining",
                value: joining
              }
            ]
          }
        })

    })
  }
}


  if (msgText === 'type') {
    msg.reply("Zie hier een tabel met type effectiviteit:", {
      file: "https://image.ibb.co/mxRthv/Untitled.png"
    });
    msg.delete()
  } else if (msgText === 'mystic') {
    msg.channel.send(
      '**Team Mystic**\nI am Blanche, leader of Team Mystic. The wisdom of Pokémon is immeasurably deep. I am researching why it is that they evolve.\nMy team? With our calm analysis of overy situation, we cant lose!', {
        file: "https://pogosa.net/images/mystic_leader.png"
      });
    setTimeout(() => {
      msg.channel.send(
        'Wat een prachtige woorden vind je niet? Met onze wijsheid kunnen we samen met onze Pokémon elke uitdaging aan!'
      );;
    }, 1000);
    msg.delete()
  } else if (msgText === 'valor') {
    msg.channel.send(
      '**Team Valor**\nI am Candela, Tem Valor Leader!. Pokemon are stronger than humans, and they are warmhearted, too! I am researching ways to enhance Pokémon natural power in the pursuit of true strength. There is no doubt that the Pokémon in our team have trained are the strongest in battle! Are you ready?', {
        file: "https://pogosa.net/images/valor_leader.png"
      });
    setTimeout(() => {
      msg.channel.send(
        'Pokemon sterker dan mensen? Bij jullie team twijfel ik daar soms over.... Dat onderzoek van jullie om pokemon sterker te maken is in elk geval hard nodig bij team faler!'
      );;
    }, 1000);
    msg.delete()
  } else if (msgText === 'instinct') {
    msg.channel.send(
      '**Team Instinct**\nHey! The names Spark- the leader of Team Instinct. Pokémon are creatures with excellent intuition. I bet the secret to their intuition is related to how theyre hatched. Come on and join my team! You never lose when you trust your instincts!', {
        file: "https://pogosa.net/images/instinct_leader.png"
      });
    setTimeout(() => {
      msg.channel.send(
        'Vertrouwen op je intuitie? We leven toch zeker niet meer in de steentijd? En wat heeft hebben die eieren daar nu weer mee te maken? Met dit soort uitspraken lijkt het soms alsof je zelf uit een ei bent gekomen...'
      );;
    }, 1000);
    msg.delete();
  } else if ((pokemon = pokemonStats.checkForPokemon(msgText)) != undefined) {

    pokemonStats.reply(msg, pokemon);
  } else {

    //gyms reply
    const gymMatch = gyms.find((gym) => {
      if (!gym.keys) {
        console.log('gym has no key', gym);
        return;
      }

      return gym.keys.find((key) => {
        return msgText.startsWith(key);
      });
    });


    if (gymMatch) {
      let embed = new Discord.RichEmbed()
        .setColor(0xffffff)
        .setURL(gymMatch.url)
        .setAuthor(gymMatch.name, "https://focalpointx.com/images/icons/icon-findmylocation.png");

      msg.channel.send({embed});
    }


    // compose message
    let reply = '**#' + pokemon.number + ' - ' + pokemon.name + '** [' +
      pokemon.type.join(', ') + ']\nWeakness:';
    if (verystrong.length > 0) {
      reply += ' x1.96: [';
      for (var i = 0; i < verystrong.length; i++) {
        reply += verystrong[i].type;
        if (i < verystrong.length - 1) {
          reply += ", ";
        }
      }
      reply += ']';
    }
    if (strong.length > 0) {
      reply += ' x1.4: [';
      for (var i = 0; i < strong.length; i++) {
        reply += strong[i].type;
        if (i < strong.length - 1) {
          reply += ", ";
        }
      }
      reply += ']';
    }
    // pokemon.recplayers can be used to identify whether the pokemon is also a raid boss
    if (pokemon.recplayers > 0) {
      reply += '\nI recommend you battle ' + pokemon.name +
        ' with a group of ' + pokemon.recplayers + ' trainers.';
    }
    if (pokemon.attacks.length || pokemon.defence.length || pokemon.recplayers >
      0) {
      reply += '```';
    }
    if (pokemon.recplayers > 0) {
      // needs to be computed
      let cpRange = pokemonStats.cpRangeWonder(pokemon, 20);
      reply += 'Wonder CP: ' + cpRange[0] + ' - ' + cpRange[1] + '\n';
    }
    if (pokemon.attacks.length) {
      reply += 'Best Attacks: ' + pokemon.attacks[0] + ' & ' + pokemon.attacks[
        1] + '\n';
    }
    if (pokemon.defence.length) {
      reply += 'Best Defense: ' + pokemon.defence[0] + ' & ' + pokemon.defence[
        1] + '\n';
    }
    if (pokemon.attacks.length || pokemon.defence.length || pokemon.recplayers >
      0) {
      reply += '```';
  }


    //message reply
    const messageMatch = messages.find((message) => {
      new Message(msg).newMessage(
        message.keys,
        message.reply
      );
    });


    if (messageMatch) {
      msg.reply(`${messageMatch.reply}`);
    }

    //pokestop spins
    const stopMatch = stops.find((stop) => {
      return msgText.startsWith(stop.key);
    });

    if (stopMatch) {
      msg.reply(stopMatch.reply);
    }

    //give trusted role, admin only
    if (msgText.startsWith('add')) {
      if (msg.member.roles.has(moderator)) {
        let member = msg.mentions.members.first();
        let role = msg.guild.roles.find("name",
          "makingdelftblueagain");
        member.addRole(role).catch(console.error);
        msg.channel.send('Welkom ' + member +
          ', je bent nu officieel toegevoegd! In het kanaal #welkom is te lezen hoe deze discord werkt, lees dat dus vooral eens door! Daarnaast sta ik natuurlijk ook tot je beschikking! Door "!help" te typen kun je zien wat ik allemaal voor je kan doen! Verder zou het fijn zijn als je in deze discord dezelfde naam gebruikt als je pogo naam, zodat we weten wie iedereen is;)'
        );
      } else {
        msg.reply(
          'Leden verifieren kan alleen door een moderator worden gedaan'
        )
      }
      msg.delete()
    } else

    //request gym roles
    if (msgText.startsWith('+centrum')) {
      let role = msg.guild.roles.find("name", "Centrum");
      msg.member.addRole(role).catch(console.error);
      msg.reply('Je hebt nu toegang tot het centrum gym kanaal!');
      msg.delete()
    } else if (msgText.startsWith('+hoven')) {
      let role = msg.guild.roles.find("name", "Hoven");
      msg.member.addRole(role).catch(console.error);
      msg.reply('Je hebt nu toegang tot het hoven gym kanaal!');
      msg.delete()
    } else if (msgText.startsWith('+tu')) {
      let role = msg.guild.roles.find("name", "TU");
      msg.member.addRole(role).catch(console.error);
      msg.reply('Je hebt nu toegang tot het tu-wijk gym kanaal!');
      msg.delete()
    } else if (msgText.startsWith('+tanthof')) {
      let role = msg.guild.roles.find("name", "Tanthof");
      msg.member.addRole(role).catch(console.error);
      msg.reply('Je hebt nu toegang tot het tanthof gym kanaal!');
      msg.delete()
    } else if (msgText.startsWith('+noord')) {
      let role = msg.guild.roles.find("name", "DelftNoord");
      msg.member.addRole(role).catch(console.error);
      msg.reply('Je hebt nu toegang tot het Noord-Delft gym kanaal!');
      msg.delete()
    } else if (msgText.startsWith('+oost')) {
      let role = msg.guild.roles.find("name", "DelftOost");
      msg.member.addRole(role).catch(console.error);
      msg.reply('Je hebt nu toegang tot het Oost-Delft gym kanaal!');
      msg.delete()
    } else if (msgText.startsWith('+english')) {
      let role = msg.guild.roles.find("name", "English");
      msg.member.addRole(role).catch(console.error);
      msg.reply('You now have access to the English channel!');
      msg.delete()
    } else

    //remove gym roles
    if (msgText.startsWith('-centrum')) {
      let role = msg.guild.roles.find("name", "Centrum");
      msg.member.removeRole(role).catch(console.error);
      msg.reply(
        'Je hebt nu geen toegang meer tot het centrum gym kanaal!');
      msg.delete()
    } else if (msgText.startsWith('-hoven')) {
      let role = msg.guild.roles.find("name", "Hoven");
      msg.member.removeRole(role).catch(console.error);
      msg.reply(
        'Je hebt nu geen toegang meer tot het hoven gym kanaal!');
      msg.delete()
    } else if (msgText.startsWith('-tu')) {
      let role = msg.guild.roles.find("name", "TU");
      msg.member.removeRole(role).catch(console.error);
      msg.reply(
        'Je hebt nu geen toegang meer tot het tu-wijk gym kanaal!');
      msg.delete()
    } else if (msgText.startsWith('-tanthof')) {
      let role = msg.guild.roles.find("name", "Tanthof");
      msg.member.removeRole(role).catch(console.error);
      msg.reply(
        'Je hebt nu geen toegang meer tot het tanthof gym kanaal!');
      msg.delete()
    } else if (msgText.startsWith('-noord')) {
      let role = msg.guild.roles.find("name", "DelftNoord");
      msg.member.removeRole(role).catch(console.error);
      msg.reply(
        'Je hebt nu geen toegang meer tot het Noord-Delft gym kanaal!');
      msg.delete()
    } else if (msgText.startsWith('-oost')) {
      let role = msg.guild.roles.find("name", "DelftOost");
      msg.member.removeRole(role).catch(console.error);
      msg.reply(
        'Je hebt nu geen toegang meer tot het Oost-Delft gym kanaal!');
      msg.delete()
    } else if (msgText.startsWith('-english')) {
      let role = msg.guild.roles.find("name", "English");
      msg.member.removeRole(role).catch(console.error);
      msg.reply('You now have lost access to the English channel!');
      msg.delete()
    } else

    //delete msgs

    if (msgText.startsWith('delete')) {
      if (msg.member.roles.has(moderator)) {
        var del = msgText.split(" ");
        del.splice(0, 1);
        msg.channel.bulkDelete(del);
      } else {
        msg.reply('Alleen moderators kunnen berichten verwijderen')
      }
      msg.delete()
    }
  }
});


//welcome new users

client.on('guildMemberAdd', member => {
  setTimeout(() => {
    member.guild.defaultChannel.send(
      `Welkom op de Mystic Delft Discord en leuk dat je onze groep wilt versterken, ${member}!
Om toegang te krijgen tot de volledige groep vragen wij een screenshot van je pokemon go profiel (dat is waar je naast je buddy staat). Als je deze kan uploaden zal een van de moderators je zo snel mogelijk te woord staan.

Welcome to our Mystic Delft Discord group, ${member}!
In order to get full access to our server, we would like to verify you are indeed mystic. If  you would be so kind as to upload a screenshot of your Pokémon Go profile (where you are standing next to your buddy) one of our moderators will contact you as soon as possible.`
    );
  }, 1000);
});

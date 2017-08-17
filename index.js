'use strict';

require('dotenv').config()

var Discord = require('discord.js');
var client = new Discord.Client();
var https = require("https");
const Message = require("./models/message")
const settings = require("./settings.json")
const gyms = require('./data/gyms.json');
const stops = require('./data/pokestops.json');
const pokemons = require('./data/pokemons.json');
const messages = require('./data/messages.json')

client.login(settings.token);

var express = require('express');
var app = express();

const pokemonStats = require('./helpers/pokemon.js');

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


client.on("message", (msg) => {
  let prefixs = settings.prefixs;

  let moderator = settings.moderator;

  // get the first character of the message content
  let msgPrefix = msg.content[0];
  // get the message content, cut the first character, convert it to all lowercase and save to new variable
  var msgText = msg.content.toLowerCase().substr(1);
  var pokemon;

  if (prefixs.indexOf(msgPrefix) < 0 || msg.author.bot) return;

  // four messages to be put into messages.json later preferably
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
      msg.reply(`**Gym: ${gymMatch.reply}`);
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

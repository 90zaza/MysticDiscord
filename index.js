"use strict";

// config
require("dotenv").config()

//discord
const Discord = require('discord.js');
const client = new Discord.Client();
client.login(process.env.TOKEN)

// other dependencies
const Sequelize = require('sequelize');

const raids = require("./helpers/raids.js");
const settings = require("./settings.json");
const Text = require("./helpers/text.js");

const GymResponse = require('./models/gym-response');
const Pokemons = require('./models/pokemons');
const PokemonResponse = require('./models/pokemon-response');
const PokemonSpottingResponse = require('./models/pokemon-spotting-response');
const GenericResponse = require('./models/generic-response');
const MusicResponse = require('./models/music-response');
const GambleResponse = require('./models/gamble-response');
const TeamResponse = require('./models/team-response');
const ChannelRolesResponse = require('./models/channel-roles-response');

//stuff that the bot should do once
const pokemons = new Pokemons().get();

raids.init();

// start script
client.on('ready', () => {
  client.user.setGame('Pokémon Go');
  console.log('Blanche: I am ready!');
});

client.on('message', async (msg) => {
  if (msg.author.bot) {
    return;
  }

  new GymResponse(msg);
  new PokemonResponse(msg, pokemons);
  new PokemonSpottingResponse(msg);
  new GenericResponse(msg);
  new MusicResponse(msg);
  new GambleResponse(msg);
  new TeamResponse(msg);
  new ChannelRolesResponse(msg);

  // delete amount of messages
  if (msg.content.startsWith("delete")) {
    if (msg.member.roles.has(moderator)) {
      var del = msg.content.split(" ");
      del.splice(0, 1);
      msg.channel.bulkDelete(del);
    } else {
      msg.reply("Alleen moderators kunnen berichten verwijderen");
    }
    msg.delete();
  }


  let prefixs = settings.prefixs;
  let moderator = settings.moderator;

  //determine if the bot activates or not
  let msgPrefix = msg.content[0];
  var msgText = msg.content.toLowerCase().substr(1).trim();
  if (prefixs.indexOf(msgPrefix) < 0) return;

  //removes prefix and spaces, and convert the rest to lowercase
  var msgText = msg.content.toLowerCase().substr(1).trim();

  //raid reply
  if (msgText.split(' ')[0] == "raid") {
    raids.scan(msg);
  }

});

//welcome new users
client.on("guildMemberAdd", member => {
  setTimeout(() => {
    member.guild.defaultChannel.send(
      `Welkom op de Mystic Delft Discord en leuk dat je onze groep wilt versterken, ${member}!
Om toegang te krijgen tot de volledige groep vragen wij een screenshot van je pokemon go profiel (dat is waar je naast je buddy staat). Als je deze kan uploaden zal een van de moderators je zo snel mogelijk te woord staan.

Welcome to our Mystic Delft Discord group, ${member}!
In order to get full access to our server, we would like to verify you are indeed mystic. If  you would be so kind as to upload a screenshot of your Pokémon Go profile (where you are standing next to your buddy) one of our moderators will contact you as soon as possible.`
    );
  }, 1000);
});

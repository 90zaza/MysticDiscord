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
const ChannelRolesResponse = require('./models/channel-roles-response');
const TopResponse = require('./models/top-response');
const DateResponse = require('./models/date-response');
const ThemeResponse = require('./models/thema-response');
const JokeOfTheDayResponse = require('./models/jokeoftheday-response')
const EggResponse = require('./models/egg-response')
const ChallengeResponse = require('./models/challenge-response')

//stuff that the bot should do once
const pokemons = new Pokemons().get();
const BotName = process.env.BOT_NAME;
const raidAnnouncmentChannel = process.env.RAID_CHANNEL;
raids.init();

// start script
client.on('ready', () => {
  // this is apperantly not a function anymore
  // client.user.setGame('Pokémon Go');
  console.log('Blanche: I am ready!');
});

client.on('message', async (msg) => {
  if (msg.author.bot) {
    return;
  }


  if (msg.channel.name == `pokemon_spotting`) {
    new PokemonSpottingResponse(msg);
  }

  //raid reply
  if (msg.channel.name == raidAnnouncmentChannel) {
    raids.scan(msg);
    setTimeout(() => {
      msg.delete();
    }, 500);

    return;
  }

  //removes prefix and spaces, and convert the rest to lowercase
  var msgText = msg.content.toLowerCase().substr(1).trim();
  let prefixs = settings.prefixs;
  let moderator = settings.moderator;

  //determine if the bot activates or not
  let msgPrefix = msg.content[0];
  if (prefixs.indexOf(msgPrefix) < 0) return;

  //list of commands
  if (msgText == 'help') {
    let embed = new Discord.MessageEmbed()
      .addField("Hey! Mijn naam is Blanche", "Naast het appraisen van jouw pokemon in game, kan ik jullie ook op deze discord assistentie verlenen. Ik reageer onder andere op de volgende commando's:")
      .addField("!pokémon", "Hierbij krijg je informatie over de pokémon die je opvraagt")
      .addField("!gymnaam", "Ik geef je de locatie van de gym")
      .addField("!raid", `Hiermee geef je een nieuwe raid aan, zie het raids_meldingen kanaal of gebruik !raid help voor meer info`)
      .addField("!top type [dps/tdo/tank]", "Hiermee geef ik een top 10 voor het type dat je aanvraagt. All geeft de algemene top 10")
      .addField("!counter pokemon", "Dit genereert een top 10 counters tegen raid bosses")
      .addField("!datum gebeurtenis", "Hiermee vraag je de datum op van een bepaalde gebeurtenis. Je kunt ook een jaaroverzicht vragen met !datum jaar")
      .addField("!+[regio/pokémon]", `Hiermee schrijf je jezelf in voor een regio of een pokémon die je interessant vind. Zie het speler_registratie kanaal`)
    msg.channel.send({ embed });
  }

  // new stuff
  new GymResponse(msg);
  new PokemonResponse(msg, pokemons);
  new GenericResponse(msg);
  new MusicResponse(msg);
  new GambleResponse(msg);
  new ThemeResponse(msg);
  new JokeOfTheDayResponse(msg);
  new DateResponse(msg);
  new TopResponse(msg);
  new EggResponse(msg);
  new ChallengeResponse(msg);

  let verifiedrole = msg.guild.roles.find("name", "makingdelftblueagain");
  let moderatorrole = msg.guild.roles.find("name", "moderators");
  let raidschannel = msg.guild.channels.find("name", "raids");
  let raidsmeldingenchannel = msg.guild.channels.find("name", "raids_meldingen");
  let welkomchannel = msg.guild.channels.find("name", "welkom");
  let spelerregistratiechannel = msg.guild.channels.find("name", "speler_registratie");

  if (msg.member.roles.has(verifiedrole.id) && (msg.content.startsWith("!+") || msg.content.startsWith("!-"))) {
    new ChannelRolesResponse(msg);
  }

  if (msgText.startsWith("add")) {
    if (msg.member.roles.has(moderatorrole.id)) {
      let member = msg.mentions.members.first();
      member.addRole(verifiedrole).catch(console.error);
      msg.channel.send(`Welkom ` + member + `, je bent nu officieel toegevoegd! In het kanaal <#` + welkomchannel.id + `> is te lezen hoe deze discord werkt, lees dat dus vooral eens door! Daarnaast sta ik natuurlijk ook tot je beschikking! Door '!help' te typen kun je zien wat ik allemaal voor je kan doen! Verder zou het fijn zijn als je in deze discord dezelfde naam gebruikt als je pogo naam, met je level erachter (channel settings, change nickname), zodat we weten wie iedereen is;)`);
    } else {
      msg.reply("Leden verifieren kan alleen door een moderator worden gedaan")
    }
    msg.delete()
  }

  if (msgText.startsWith("feliciteer")) {
    let member = msg.mentions.members.first();
    msg.channel.send(`Gefeliciteerd met het behalen van deze uitzonderlijke prestatie, ` + member + `! Als je op dezelfde fantastische manier doorgaat zal je een geweldige toekomst tegemoed gaan, ik ben heel erg trots op je!`);
    msg.delete()
  }

  // delete amount of messages
  if (msgText.startsWith("delete")) {
    msg.delete();
    if (msg.member.roles.has(moderatorrole.id)) {
      msg.channel.bulkDelete(msgText.substr(msgText.indexOf(" ") + 1));
    } else {
      msg.reply("Alleen moderators kunnen berichten verwijderen");
    }
  }

  //determine if the bot activates or not
  var msgText = msg.content.toLowerCase().substr(1).trim();
  if (prefixs.indexOf(msgPrefix) < 0) return;

  //removes prefix and spaces, and convert the rest to lowercase
  var msgText = msg.content.toLowerCase().substr(1).trim();

  //raid reply
  if (msgText.split(' ')[0] == "raid") {
    msg.content = msg.content.substr(5);
    raids.scan(msg);
  }
  if (msgText.split(' ')[0] == "join") {
    msg.content = `raid ${msgText}`;
    raids.scan(msg);
  }
  if (msgText.split(' ')[0] == "leave") {
    msg.content = `raid ${msgText}`;
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

//bring extra people to raids funtion
client.on('messageReactionAdd', (messageReaction, user) => {
  if (!user.bot) {
    //check for correct channel
    if (messageReaction.message.channel.name == raidAnnouncmentChannel) {
      raids.messageReactionAdd(messageReaction, user);
    }
  }
});

process.on('exit', () => {
  client.destroy();
});

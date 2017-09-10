"use strict";


const Sequelize = require("sequelize");

require("dotenv").config()

var Discord = require("discord.js");
var client = new Discord.Client();
var https = require("https");
const Message = require("./models/message")
const settings = require("./settings.json")
const gyms = require("./data/gyms.json");
const stops = require("./data/pokestops.json");
const pokemons = require("./data/pokemons.json");
const defense = require("./data/defense.json");
const messages = require("./data/messages.json");

client.login(process.env.TOKEN)

var express = require('express');
var app = express();

const Gym = require("./helpers/gym.js");
const Music = require("./helpers/music.js");
const Rarepokemon = require("./helpers/rarepokemon.js");
const pokemonStats = require("./helpers/pokemon.js");
pokemonStats.calculateRanks();

const raids = require("./helpers/raids.js");
raids.init();

app.set("port", (process.env.PORT || 9222));

app.use(express.static(__dirname + "/public"));
app.listen(app.get("port"), function() {
  console.log("Node app is running on port", app.get("port"));

  setInterval(function() {
    https.get("https://discord-pokemon.herokuapp.com/helloworld.html");
  }, 300000); // every 5 minutes (300000)
});

client.on('ready', () => {
  client.user.setGame('Pokémon Go');
  console.log('Blanche: I am ready!');
})

client.on("message", async (msg) => {
if (msg.author.bot) return;
var pokemon, gym;

//pokemon spotting
let spotting = msg.guild.channels.find("name", "pokemon_spotting");
if (msg.channel == spotting) {
  var msgText = msg.content.toLowerCase()

  if (msgText.includes("shiny")) {
    msg.author.send(`Shiny's zijn helaas individueel bepaald. Voor jou een shiny is voor een ander dus waarschijnlijk gewoon normaal.`);
    msg.delete();
    return;
  }
  if (msgText.includes("100%") || msgText.includes("100 %") || msgText.includes("perfect")) {
    msg.channel.send(`Er is een 100% IV pokémon gespot, @everyone! (alleen voor lvl 30+)`);
    return;
  }


  if ((pokemon = Rarepokemon.checkForPokemon(msgText)) != undefined) {
    Rarepokemon.reply(msg, pokemon);
  }
}

let prefixs = settings.prefixs;
let moderator = settings.moderator;

//determine if the bot activates or not
let msgPrefix = msg.content[0];
var msgText = msg.content.toLowerCase().substr(1).trim();
if (prefixs.indexOf(msgPrefix) < 0) return;

//removes prefix and spaces, and convert the rest to lowercase
var msgText = msg.content.toLowerCase().substr(1).trim();

var pokemon, gym, music;


//raid reply
if (msgText.split(' ')[0] == "raid") {
    raids.scan(msg);}

//pokemon reply
if ((pokemon = pokemonStats.checkForPokemon(msgText)) != undefined) {
    pokemonStats.reply(msg, pokemon);}


//gym location reply
if ((gym = Gym.checkForGym(msgText)) != undefined) {
    Gym.reply(msg, gym);}


//reply with extra options
if (msgText === "dobbel" || msgText === "gamble") {
   msg.reply("<:game_die:349868481673428992>: " + (Math.floor(Math.random()*6)+1));
   msg.delete()}

if (msgText === "muziek" || msgText === "music") {
  msgText = Math.floor(Math.random() * 29);
  if ((music = Music.checkForMusic(msgText)) != undefined) {
    Music.reply(msg, music);}
}

if (msgText === "mystic") {
  msg.delete()
  let embed = new Discord.RichEmbed()
    .setColor(0x0000ff)
    .setThumbnail("https://vignette2.wikia.nocookie.net/pokemon/images/3/35/Blanche-GO.png/revision/latest?cb=20160726200247.png")
    .addField("Team Mystic","I am Blanche, leader of Team Mystic. The wisdom of Pokémon is immeasurably deep. I am researching why it is that they evolve.\nMy team? With our calm analysis of overy situation, we can't lose!")
  msg.channel.send({embed});
  setTimeout(() => {msg.channel.send("Wat een prachtige woorden vind je niet? Met onze wijsheid kunnen we samen met onze Pokémon elke uitdaging aan!");;},1000);}

if (msgText === "valor") {
  msg.delete()
  let embed = new Discord.RichEmbed()
    .setColor(0xff0000)
    .setThumbnail("https://vignette4.wikia.nocookie.net/pokemon/images/c/ce/Candela-GO.png/revision/latest?cb=20160726200643.png")
    .addField("Team Valor","I am Candela, Team Valor Leader! Pokemon are stronger than humans, and they are warmhearted, too! I am researching ways to enhance Pokémon natural power in the pursuit of true strength. There is no doubt that the Pokémon in our team have trained are the strongest in battle! Are you ready?")
  msg.channel.send({embed});
  setTimeout(() => {msg.channel.send("Pokemon sterker dan mensen? Bij jullie team twijfel ik daar soms over.... Dat onderzoek van jullie om pokemon sterker te maken is in elk geval hard nodig bij team faler!");;},1000);}

if (msgText === "instinct") {
  msg.delete()
  let embed = new Discord.RichEmbed()
    .setColor(0xffff00)
    .setThumbnail("https://vignette2.wikia.nocookie.net/pokemon/images/8/86/Spark-GO.png/revision/latest?cb=20160726200039.png")
    .addField("Team Instinct","Hey! The name's Spark- the leader of Team Instinct. Pokémon are creatures with excellent intuition. I bet the secret to their intuition is related to how they're hatched. Come on and join my team! You never lose when you trust your instincts!")
  msg.channel.send({embed});
  setTimeout(() => {msg.channel.send("Vertrouwen op je intuitie? We leven toch zeker niet meer in de steentijd? En wat hebben die eieren daar nu weer mee te maken? Met dit soort uitspraken lijkt het soms alsof je zelf uit een ei bent gekomen...");;},1000);}


//message reply
const messageMatch = messages.find((message) => {
new Message(msg).newMessage(message.keys, message.reply);
});

if (messageMatch) {
   msg.reply(`${messageMatch.reply}`);}


//pokestop spins
const stopMatch = stops.find((stop) => {
  return msgText.startsWith(stop.key);});

if (stopMatch) {
    msg.reply(stopMatch.reply);}


//give trusted role, admin only
if (msgText.startsWith("add")) {
  if (msg.member.roles.has(moderator)) {
     let member = msg.mentions.members.first();
     let role = msg.guild.roles.find("name",
     "makingdelftblueagain");
     member.addRole(role).catch(console.error);
     msg.channel.send(`Welkom ` + member + `, je bent nu officieel toegevoegd! In het kanaal <#` + settings.welkom + `> is te lezen hoe deze discord werkt, lees dat dus vooral eens door! Daarnaast sta ik natuurlijk ook tot je beschikking! Door '!help' te typen kun je zien wat ik allemaal voor je kan doen! Verder zou het fijn zijn als je in deze discord dezelfde naam gebruikt als je pogo naam, met je level erachter (channel settings, change nickname), zodat we weten wie iedereen is;)`);}
  else {
     msg.reply("Leden verifieren kan alleen door een moderator worden gedaan")}
     msg.delete()}


//request gym roles
if (msgText.startsWith("+centrum")) {
    let role = msg.guild.roles.find("name", "Centrum");
    msg.member.addRole(role).catch(console.error);
    msg.reply("Je hebt nu toegang tot het centrum gym kanaal!");
    msg.delete()}
if (msgText.startsWith("+hoven")) {
    let role = msg.guild.roles.find("name", "Hoven");
    msg.member.addRole(role).catch(console.error);
    msg.reply("Je hebt nu toegang tot het hoven gym kanaal!");
    msg.delete()}
if (msgText.startsWith("+tu")) {
    let role = msg.guild.roles.find("name", "TU");
    msg.member.addRole(role).catch(console.error);
    msg.reply("Je hebt nu toegang tot het tu-wijk gym kanaal!");
    msg.delete()}
if (msgText.startsWith("+tanthof")) {
    let role = msg.guild.roles.find("name", "Tanthof");
    msg.member.addRole(role).catch(console.error);
    msg.reply("Je hebt nu toegang tot het tanthof gym kanaal!");
    msg.delete()}
if (msgText.startsWith("+noord")) {
    let role = msg.guild.roles.find("name", "DelftNoord");
    msg.member.addRole(role).catch(console.error);
    msg.reply("Je hebt nu toegang tot het Noord-Delft gym kanaal!");
    msg.delete()}
if (msgText.startsWith("+oost")) {
    let role = msg.guild.roles.find("name", "DelftOost");
    msg.member.addRole(role).catch(console.error);
    msg.reply("Je hebt nu toegang tot het Oost-Delft gym kanaal!");
    msg.delete()}
if (msgText.startsWith("+english")) {
    let role = msg.guild.roles.find("name", "English");
    msg.member.addRole(role).catch(console.error);
    msg.reply("You now have access to the English channel!");
    msg.delete()}


//remove gym roles
if (msgText.startsWith("-centrum")) {
    let role = msg.guild.roles.find("name", "Centrum");
    msg.member.removeRole(role).catch(console.error);
    msg.reply("Je hebt nu geen toegang meer tot het centrum gym kanaal!");
    msg.delete()}
if (msgText.startsWith("-hoven")) {
    let role = msg.guild.roles.find("name", "Hoven");
    msg.member.removeRole(role).catch(console.error);
    msg.reply("Je hebt nu geen toegang meer tot het hoven gym kanaal!");
    msg.delete()}
if (msgText.startsWith("-tu")) {
    let role = msg.guild.roles.find("name", "TU");
    msg.member.removeRole(role).catch(console.error);
    msg.reply("Je hebt nu geen toegang meer tot het tu-wijk gym kanaal!");
    msg.delete()}
if (msgText.startsWith("-tanthof")) {
    let role = msg.guild.roles.find("name", "Tanthof");
    msg.member.removeRole(role).catch(console.error);
    msg.reply("Je hebt nu geen toegang meer tot het tanthof gym kanaal!");
    msg.delete()}
if (msgText.startsWith("-noord")) {
    let role = msg.guild.roles.find("name", "DelftNoord");
    msg.member.removeRole(role).catch(console.error);
    msg.reply("Je hebt nu geen toegang meer tot het Noord-Delft gym kanaal!");
    msg.delete()}
if (msgText.startsWith("-oost")) {
    let role = msg.guild.roles.find("name", "DelftOost");
    msg.member.removeRole(role).catch(console.error);
    msg.reply("Je hebt nu geen toegang meer tot het Oost-Delft gym kanaal!");
    msg.delete()}
if (msgText.startsWith("-english")) {
    let role = msg.guild.roles.find("name", "English");
    msg.member.removeRole(role).catch(console.error);
    msg.reply("You now have lost access to the English channel!");
    msg.delete()}


//delete msgs
if (msgText.startsWith("delete")) {
  if (msg.member.roles.has(moderator)) {
       var del = msgText.split(" ");
       del.splice(0, 1);
       msg.channel.bulkDelete(del);}
    else {
       msg.reply("Alleen moderators kunnen berichten verwijderen")}
       msg.delete()}
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

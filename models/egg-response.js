const Discord = require('discord.js');
const Message = require('./message');

module.exports = class GenericResponse extends Message {
  constructor(message) {
    super(message);

    // startsWith is only necessary because its different then the normal messages
    if(this.startsWith('egg') || this.startsWith('ei')) {

    let name;
    let distance;
    let eggImage;
    let rarity;

    const commonPokemon = ["Pichu", "Nidoran-m", "Nidoran-f", "Geodude", "Krabby", "Poliwag", "Ponyta", "Phanpy"];
    const commonDistance = [2,2,2,2,2,5,5];
    const commonNumber = [];
    const commonOdds = 3.1*commonPokemon.length;

    const uncommonPokemon = ["Oddish", "Diglett", "Abra", "Machop", "Exeggcute", "Slowpoke", "Gastly", "Spinarak", "Cleffa", "Igglybuff", "Togepi", "Slugma", "Aipom", "Growlithe", "Shellder", "Drowzee", "Voltorb", "Cubone", "Rhyhorn", "Eevee", "Chinchou", "Natu", "Marill", "Hoppip", "Wooper", "Swinub", "Tyrogue", "Smoochum", "Mantine", "Elekid", "Magby", "Porygon", "Dratini", "Mareep", "Larvitar"];
    const uncommonDistance = [2,2,2,2,2,2,2,2,2,2,2,2,2,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,10,10,10,10];
    const uncommonNumber = [];
    const uncommonOdds = 1.6*uncommonPokemon.length;

    const rarePokemon = ["Remoraid", "Seel", "Onix", "Tangela", "Scyther", "Pinsir", "Chikorita", "Cyndaquil", "Totodile", "Snubbull", "Teddiursa", "Houndour", "Stantler", "Chansey", "Skarmory", "Sudowoodo"];
    const rareDistance = [2,5,5,5,5,5,5,5,5,5,5,5,5,10,10,10];
    const rareNumber = [];
    const rareOdds = 0.8*rarePokemon.length;

    const veryrarePokemon = ["Misdreavus", "Grimer", "Lickitung", "Koffing", "Omanyte", "Kabuto", "Pineco", "Gligar", "Qwilfish", "Sneasel", "Lapras", "Aerodactyl", "Snorlax", "Miltank"];
    const veryrareDistance = [2,5,5,5,5,5,5,5,5,5,10,10,10,10];
    const verryrareNumber = [];
    const veryrareOdds = 0.4*veryrarePokemon.length;

    const superrarePokemon = ["Wobbuffet", "Girafarig", "Dunsparce", "Shuckle"];
    const superrareDistance = [5,5,5,5];
    const superrareNumber = [];
    const superrareOdds = 0.2*superrarePokemon.length;

    const rand1 = Math.random()*100;

    //common hatch
    if (rand1 < commonOdds) {
      const rand2 = Math.floor(Math.random() * commonPokemon.length);
      name = commonPokemon[rand2];
      distance = commonDistance[rand2];
      rarity = "common";
    }

    //uncommon hatch
    else if (rand1 < (commonOdds+uncommonOdds)) {
      const rand2 = Math.floor(Math.random() * uncommonPokemon.length);
      name = uncommonPokemon[rand2];
      distance = uncommonDistance[rand2];
      rarity = "uncommon";
    }

    //rare hatch
    else if (rand1 < (commonOdds+uncommonOdds+rareOdds)) {
      const rand2 = Math.floor(Math.random() * rarePokemon.length);
      name = rarePokemon[rand2];
      distance = rareDistance[rand2];
      rarity = "rare";
    }

    //veryrare hatch
    else if (rand1 < (commonOdds+uncommonOdds+rareOdds+veryrareOdds)) {
      const rand2 = Math.floor(Math.random() * veryrarePokemon.length);
      name = veryrarePokemon[rand2];
      distance = veryrareDistance[rand2];
      rarity = "very rare";
    }

    //superrare hatch
    else if (rand1 < (commonOdds+uncommonOdds+rareOdds+veryrareOdds+superrareOdds)) {
      const rand2 = Math.floor(Math.random() * superrarePokemon.length);
      name = superrarePokemon[rand2];
      distance = superrareDistance[rand2];
      rarity = "super rare";

    }

    //IV's
    const att = Math.floor(Math.random() * 6)+10;
    const def = Math.floor(Math.random() * 6)+10;
    const sta = Math.floor(Math.random() * 6)+10;


    if (distance == 2) {eggImage = 'https://image.ibb.co/khfzcb/2km.png'}
    else if (distance == 5) {eggImage = 'https://image.ibb.co/dOoViG/5km.png'}
    else if (distance == 10) {eggImage = 'https://image.ibb.co/b3OkHb/eggs.png'}

    let sprite = "shiny"
    if (Math.random()>0.01) {
      sprite = "normal";
    };

    let imageURL = `https://img.pokemondb.net/sprites/x-y/${sprite}/${name.toLowerCase()}.png`;


    const embed = new Discord.MessageEmbed()
      .setTitle("OH?")
      .setThumbnail(eggImage)
      .setDescription(`${this.message.author.username}'s egg is hatching!'`);
    super.newMessage({embed});

setTimeout(() => {super.newMessage(".");}, 2000);
setTimeout(() => {super.newMessage(".");}, 4000);
setTimeout(() => {super.newMessage(".");}, 6000);

setTimeout(() => {
    const embed = new Discord.MessageEmbed()
      .setTitle(`Congratulations! ${name} was hatched!`)
      .setThumbnail(imageURL)
      .setDescription(`IV: ${att} ${def} ${sta}\nRarity: ${rarity}`);
    super.reply({embed})
}, 8000);

  }
}
}

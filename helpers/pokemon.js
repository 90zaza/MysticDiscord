const Discord = require('discord.js');
const pokemons = require('../data/pokemons.json');
const defense = require('../data/defense.json');

const cpMultiplier = [0.094,      0.16639787, 0.21573247, 0.25572005, 0.29024988,
                      0.3210876 , 0.34921268, 0.37523559, 0.39956728, 0.42250001,
                      0.44310755, 0.46279839, 0.48168495, 0.49985844, 0.51739395,
                      0.53435433, 0.55079269, 0.56675452, 0.58227891, 0.59740001,
                      0.61215729, 0.62656713, 0.64065295, 0.65443563, 0.667934,
                      0.68116492, 0.69414365, 0.70688421, 0.71939909, 0.7317,
                      0.73776948, 0.74378943, 0.74976104, 0.75568551, 0.76156384,
                      0.76739717, 0.7731865,  0.77893275, 0.78463697, 0.79030001];

const colors = {
  "normal": 0x212121,
  "fighting": 0xd56723,
  "flying": 0x3dc7ef,
  "poison": 0xb97fc9,
  "ground": 0xab9842,
  "rock": 0xa38c21,
  "bug": 0x729f3f,
  "ghost": 0x7b62a3,
  "steel": 0x9eb7b8,
  "fire": 0xfd7d24,
  "water": 0x4592c4,
  "grass": 0x9bcc50,
  "electric": 0xeed535,
  "psychic": 0xf366b9,
  "ice": 0x51c4e7,
  "dragon": 0xf16e57,
  "dark": 0x707070,
  "fairy": 0xfdb9e9
}

exports.calculateRanks = function () {

  for (let i = 0; i < pokemons.length; i++) {

    pokemons[i].ranks = [1, 1, 1];
    let stats = pokemons[i].stats;
    for (let j = 0; j < pokemons.length; j++) {

      if (pokemons[j].stats[0] > stats[0]) {
        ++pokemons[i].ranks[0];
      }
      if (pokemons[j].stats[1] > stats[1]) {
        ++pokemons[i].ranks[1];
      }
      if (pokemons[j].stats[2] > stats[2]) {
        ++pokemons[i].ranks[2];
      }
    }
  }
}

// This function computes the CP range for a guaranteed wonder of a pokemon at a given level
// guaranteed wonder is different from the complete wonder range, because of CP overlap between different IV ranges
// i.e. a 80% IV with a lot of attack can have a higher CP than an 82.2% IV with little attack
exports.cpRangeWonder = function (pokemon, level) {

  let m = cpMultiplier[level - 1];

  // For max CP all IVs are 15
  let atkval = (pokemon.stats[0] + 15) * m;
  let defval = Math.sqrt((pokemon.stats[1] + 15) * m);
  let staval = Math.sqrt((pokemon.stats[2] + 15) * m);
  let maxCP = Math.floor(atkval * defval * staval * 0.1);

  // Search for the highest CP for 80% IV. This will always be atk = 15 so we check for (def + sta == 21)
  // The min guaranteed CP for a wonder is then the max 80% CP + 1
  let minCP = 0;
  for (var s = 7; s < 16; s++) {
    for (var d = 7; d < 16; d++) {
      if (s + d == 21)
      {
        defval = Math.sqrt((pokemon.stats[1] + d) * m);
        staval = Math.sqrt((pokemon.stats[2] + s) * m);
        let cp = Math.floor( atkval * defval * staval * 0.1);

        if (cp > minCP) {
          minCP = cp;
        }
      }
    }
  }

  ++minCP;

  return [minCP, maxCP];
}

exports.checkForPokemon = function (msgText) {

  let pokemon = pokemons.find((p) => {

    if (!p.keys) {
      console.log('pokemon has no key', p);
      return;
    }
    return p.keys.find((key) => {
      return msgText == key;
    });
  });

  return pokemon;
}

exports.reply = function (msg, pokemon) {


  if (Math.random()>0.02) {sprite="normal"} //2% chance on a shiny sprite
  else {sprite="shiny"}


  gender=""; //50/50 gender

  if (pokemon.gender==true) {
    if (Math.random()>0.5) {gender="-f"};} //gender

  let imageURL = "https://img.pokemondb.net/sprites/x-y/" + sprite + "/" + pokemon.name.toLowerCase() + gender +".png";

  let embed = new Discord.RichEmbed()
    .setTitle("#" + pokemon.number + " - " + pokemon.name + " [" + pokemon.type.join(", ") + "]", imageURL)
    .setThumbnail(imageURL)
    .setURL("https://pokemongo.gamepress.gg/pokemon/" + pokemon.number)
    .setColor(colors[pokemon.type[0]]);

  // pokemon.recplayers can be used to identify whether the pokemon is also a raid boss
  if (pokemon.recplayers > 0) {
    embed.setDescription("Bring at least " + pokemon.recplayers + " trainers to a raid battle.");
  }

  // dynamically compute defense values for type combinations
  let def = JSON.parse(JSON.stringify(defense[pokemon.type[0]]));
  for (var i = 1; i < pokemon.type.length; i++) {
    for (var j = 0; j < def.length; j++) {
      def[j].mult *= defense[pokemon.type[i]][j].mult;
    }
  }

  // filter for 1.96 and 1.4
  let verystrong = def.filter((d) => {
    return d.mult > 1.5;
  });
  let strong = def.filter((d) => {
    return (d.mult > 1.1 && d.mult < 1.5);
  });

  let weakness = "";
  if (verystrong.length > 0) {
    weakness += ' x1.96: ';
    if (verystrong.length > 1) {
      weakness += '[';
    }
    for (var i = 0; i < verystrong.length; i++) {
      weakness += verystrong[i].type;
      if (i < verystrong.length - 1) {
        weakness += ", ";
      }
    }
    if (verystrong.length > 1) {
      weakness += ']';
    }
  }
  if (strong.length > 0) {
    weakness += ' x1.4: ';
    if (verystrong.length > 1) {
      weakness += '[';
    }
    for (var i = 0; i < strong.length; i++) {
      weakness += strong[i].type;
      if (i < strong.length - 1) {
        weakness += ", ";
      }
    }
    if (verystrong.length > 1) {
      weakness += ']';
    }
  }

  embed.addField("Weakness", weakness);

  embed.addField("Basestats", "atk: " + pokemon.stats[0] + " (" + pokemon.ranks[0] + "), def: " + pokemon.stats[1] + " (" + pokemon.ranks[1] + "), sta: " + pokemon.stats[2] + " (" + pokemon.ranks[2] + ")");

  if (pokemon.recplayers > 0) {

    let cpRange = this.cpRangeWonder(pokemon, 20);
    embed.addField("CP range for guaranteed level 20 wonder", cpRange[0] + " - " + cpRange[1]);
  }

  if (pokemon.attacks.length ) {

    embed.addField("Best Attack Moveset", pokemon.attacks[0] + ' & ' + pokemon.attacks[1], true);
  }

  if (pokemon.defence.length ) {

    embed.addField("Best Defense Moveset", pokemon.defence[0] + ' & ' + pokemon.defence[1], true);
  }

  msg.channel.send({embed});
  msg.delete()
}

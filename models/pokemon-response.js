const Discord = require('discord.js');
const Message = require('./message');
const gyms = require('../data/gyms.json');
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

module.exports = class PokemonResponse extends Message {
  constructor(message, pokemons) {
    super(message);
    this.pokemons = pokemons;
    this.pokemon = this.getPokemon();

    if(this.pokemon) {
      this.reply();
    }
  }

  getPokemon() {
    return this.startsWithKey(this.pokemons);
  }

  reply() {
    let sprite, gender;

    if (Math.random()>0.02) {
      sprite = 'normal';
    } //2% chance on a shiny sprite
    else {
      sprite = 'shiny';
    }


    gender=""; //50/50 gender

    if (this.pokemon.gender == true) {
      if (Math.random() > 0.5) {
        gender = '-f';
      };
    } //gender

    let imageURL = `https://img.pokemondb.net/sprites/x-y/${sprite}/${this.pokemon.name.toLowerCase()}${gender}.png`;

    let embed = new Discord.RichEmbed()
      .setTitle("#" + this.pokemon.number + " - " + this.pokemon.name + " [" + this.pokemon.type.join(", ") + "]", imageURL)
      .setThumbnail(imageURL)
      .setURL("https://pokemongo.gamepress.gg/pokemon/" + this.pokemon.number)
      .setColor(colors[this.pokemon.type[0]]);

    // pokemon.recplayers can be used to identify whether the pokemon is also a raid boss
    if (this.pokemon.recplayers > 0) {
      embed.setDescription("Bring at least " + this.pokemon.recplayers + " trainers to a raid battle.");
    }
    if (this.pokemon.description != 0) {
      embed.setFooter(this.pokemon.description);
    }

    // dynamically compute defense values for type combinations
    let def = JSON.parse(JSON.stringify(defense[this.pokemon.type[0]]));
    for (var i = 1; i < this.pokemon.type.length; i++) {
      for (var j = 0; j < def.length; j++) {
        def[j].mult *= defense[this.pokemon.type[i]][j].mult;
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

    embed.addField("Basestats", "atk: " + this.pokemon.stats[0] + " (" + this.pokemon.ranks[0] + "), def: " + this.pokemon.stats[1] + " (" + this.pokemon.ranks[1] + "), sta: " + this.pokemon.stats[2] + " (" + this.pokemon.ranks[2] + ")");

    if (this.pokemon.recplayers > 0) {

      let cpRange = this.cpRangeWonder(this.pokemon, 20);
      embed.addField("CP range for guaranteed level 20 wonder", cpRange[0] + " - " + cpRange[1]);
    }

    if (this.pokemon.attacks.length ) {

      embed.addField("Best Attack Moveset", this.pokemon.attacks[0] + ' & ' + this.pokemon.attacks[1], true);
    }

    if (this.pokemon.defence.length ) {

      embed.addField("Best Defense Moveset", this.pokemon.defence[0] + ' & ' + this.pokemon.defence[1], true);
    }

    super.reply({embed});
  }

  cpRangeWonder(pokemon, level) {
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
}

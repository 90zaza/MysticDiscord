const Discord = require('discord.js');
const Message = require('./message');
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
    if(this.pokemon && !(this.pokemon.number < 0)) {
      this.newMessage();
    }
  }

  getPokemon() {
    return this.totalMatchKey(this.pokemons);
  }

  newMessage() {
    //determine shiny (1%)
    let sprite = "shiny"
    if (Math.random()>0.01) {
      sprite = "normal";
    };

    //determine gender
    let gender="";
    if (Math.random() < this.pokemon.gender) {
      gender = "-f";
    };

    let imageURL = `https://img.pokemondb.net/sprites/x-y/${sprite}/${this.pokemon.name.toLowerCase()}${gender}.png`;

    //unown forms
    if (this.pokemon.name.toLowerCase() == "unown") {
      let random=Math.random();
      let letter="";
      if (random<1/28) {letter="unown-a"}
      else if (random<2/28) {letter="unown-b"}
      else if (random<3/28) {letter="unown-c"}
      else if (random<4/28) {letter="unown-d"}
      else if (random<5/28) {letter="unown-e"}
      else if (random<6/28) {letter="unown-f"}
      else if (random<7/28) {letter="unown-g"}
      else if (random<8/28) {letter="unown-h"}
      else if (random<9/28) {letter="unown-i"}
      else if (random<10/28) {letter="unown-j"}
      else if (random<11/28) {letter="unown-k"}
      else if (random<12/28) {letter="unown-l"}
      else if (random<13/28) {letter="unown-m"}
      else if (random<14/28) {letter="unown-n"}
      else if (random<15/28) {letter="unown-o"}
      else if (random<16/28) {letter="unown-p"}
      else if (random<17/28) {letter="unown-q"}
      else if (random<18/28) {letter="unown-r"}
      else if (random<19/28) {letter="unown-s"}
      else if (random<20/28) {letter="unown-t"}
      else if (random<21/28) {letter="unown-u"}
      else if (random<22/28) {letter="unown-v"}
      else if (random<23/28) {letter="unown-w"}
      else if (random<24/28) {letter="unown-x"}
      else if (random<25/28) {letter="unown-y"}
      else if (random<26/28) {letter="unown-z"}
      else if (random<27/28) {letter="unown-em"}
      else if (random<28/28) {letter="unown-qm"}

      imageURL = `https://img.pokemondb.net/sprites/omega-ruby-alpha-sapphire/dex/${sprite}/${letter}.png`
    }

    //nidoran m/f forms
    if (this.pokemon.name.toLowerCase() == "nidoran♀") {
      imageURL = `https://img.pokemondb.net/sprites/x-y/${sprite}/nidoran-f.png`;
    }
    if (this.pokemon.name.toLowerCase() == "nidoran♂") {
      imageURL = `https://img.pokemondb.net/sprites/x-y/${sprite}/nidoran-m.png`;
    }


    //castform forms
    if (this.pokemon.name.toLowerCase() == "castform") {
      let random=Math.random();
      let weather="castform";
      this.pokemon.type=["normal"];
      if (random<1/4) {weather="castform-rainy"; this.pokemon.type=["water"];}
      else if (random<2/4) {weather="castform-sunny"; this.pokemon.type=["fire"];}
      else if (random<3/4) {weather="castform-snowy"; this.pokemon.type=["ice"];}

      imageURL = `https://img.pokemondb.net/sprites/x-y/${sprite}/${weather}.png`;
    }

    //ditto forms
    if (this.pokemon.name.toLowerCase() == "ditto") {
      let random=Math.random();
      let transform="ditto";
      if (random<1/8) {transform="pidgey";}
      else if (random<2/8) {transform="zubat";}
      else if (random<3/8) {transform="yanma";}
      else if (random<4/8) {transform="rattata";}
      else if (random<5/8) {transform="sentret";}
      else if (random<6/8) {transform="hoothoot";}

      imageURL = `https://img.pokemondb.net/sprites/x-y/${sprite}/${transform}.png`;
    }

    //pichu forms
    if (this.pokemon.name.toLowerCase() == "pichu") {
      let random=Math.random();
      if (random<1/20) {
        imageURL=`https://vignette.wikia.nocookie.net/pokemongo/images/5/57/Pichu_ash_m.png/revision/latest?cb=20170816165509`;
      }
      else if (random<2/20) {
        imageURL=`https://vignette.wikia.nocookie.net/pokemongo/images/7/7a/Pichu_festive_m.png/revision/latest?cb=20170816165250`;
      }
      else if (random<3/20) {
        imageURL=`https://vignette.wikia.nocookie.net/pokemongo/images/1/11/Pichu_witch_m.png/revision/latest?cb=20171020155931`;
      }
    }


    //pikachu forms
    if (this.pokemon.name.toLowerCase() == "pikachu") {
      let random=Math.random();
      this.pokemon.type=["electric"];
      if (random<1/20) {
        imageURL=`https://vignette.wikia.nocookie.net/pokemongo/images/a/a7/Pikachu_festive_m.png/revision/latest?cb=20170816164048`;
      }
      else if (random<2/20) {
        imageURL=`https://vignette.wikia.nocookie.net/pokemongo/images/1/1e/Pikachu_party_m.png/revision/latest?cb=20170816164051`;
      }
      else if (random<3/20) {
        imageURL=`https://vignette.wikia.nocookie.net/pokemongo/images/4/49/Pikachu_witch_m.png/revision/latest?cb=20171020155234`;
      }
      else if (random<4/20) {
        imageURL=`https://vignette.wikia.nocookie.net/pokemongo/images/1/17/Pikachu_ash_m.png/revision/latest?cb=20170816164045`;
      }
      else if (random<5/20) {
        imageURL=`https://cdn.bulbagarden.net/upload/a/a0/Flying_Pikachu_Yellow.png`;
        this.pokemon.type=["flying", "electric"];
      }
      else if (random<6/20) {
        imageURL=`http://pixelartmaker.com/art/5191f3dfbdbd026.png`;
        this.pokemon.type=["water", "electric"];
      }
    }

    //raichu forms
    if (this.pokemon.name.toLowerCase() == "raichu") {
      let random=Math.random();
      if (random<1/20) {
        imageURL=`https://vignette.wikia.nocookie.net/pokemongo/images/f/fe/Raichu_witch_m.png/revision/latest?cb=20171020155334`;
      }
      else if (random<2/20) {
        imageURL=`https://vignette.wikia.nocookie.net/pokemongo/images/c/c1/Raichu_festive_m.png/revision/latest?cb=20170816161314`;
      }
      else if (random<3/20) {
        imageURL=`https://vignette.wikia.nocookie.net/pokemongo/images/c/c8/Raichu_ash_m.png/revision/latest?cb=20170816161234`;
      }
      else if (random<4/20) {
        imageURL=`https://vignette.wikia.nocookie.net/pokemongo/images/c/ca/Raichu_party_m.png/revision/latest?cb=20170816161351`;
      }
    }


    //missingno
    if (this.pokemon.name.toLowerCase() == "missingno") {
      imageURL = 'https://vignette.wikia.nocookie.net/nintendo/images/8/85/MissingNoNormal.png/revision/latest?cb=20131114211037&path-prefix=en'
    }
    let embed = new Discord.MessageEmbed()
      .setTitle("#" + this.pokemon.number + " - " + this.pokemon.name + " [" + this.pokemon.type.join(", ") + "]")
      .setThumbnail(imageURL)
      .setURL("https://pokemongo.gamepress.gg/pokemon/" + this.pokemon.number)
      .setColor(colors[this.pokemon.type[0]]);

    // pokemon.recplayers can be used to identify whether the pokemon is also a raid boss
    if (this.pokemon.recplayers > 0) {
      embed.setDescription(`lvl 30 players needed for a raid: ~${this.pokemon.recplayers}`);
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

    let cpRange = this.cpRangeWonder(this.pokemon, 20);
    embed.addField("CP range for guaranteed level 20 wonder", cpRange[0] + " - " + cpRange[1]);

    if (this.pokemon.attacks.length ) {

      embed.addField("Best Attack Moveset", this.pokemon.attacks[0] + ' & ' + this.pokemon.attacks[1], true);
    }

    if (this.pokemon.defence.length ) {

      embed.addField("Best Defense Moveset", this.pokemon.defence[0] + ' & ' + this.pokemon.defence[1], true);
    }

    super.newMessage({embed});
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

const Discord = require('discord.js');
const Message = require('./message');
const moves = require('../data/moves.json');

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



module.exports = class GenericResponse extends Message {
  constructor(message) {
    super(message);

      this.moves = this.getMoves();
      if(this.moves) {
        this.newMessage();
      }
  }

  getMoves() {
    return this.totalMatchKey(moves);
  }

  newMessage() {
    const img = `https://pokemongo.gamepress.gg/sites/default/files/2016-07/${this.moves.type}.gif`;
    const dps = Number(this.moves.power)/Number(this.moves.time);
    const url = `https://pokemongo.gamepress.gg/pokemon-move/${this.moves.name.replace(" ","-")}`;
    let moveDescription;
    let sort = "fast";

    if(this.moves.description!=0){
      //charge move with description
      if(this.moves.eps == 0) {
        sort = "charge";
        moveDescription = `Bars:        ${this.moves.bars}\nPower:     ${this.moves.power}\nTimeout: ${this.moves.time}\n\n${this.moves.description}`;

      //fast move with description
      } else {
        moveDescription = `dps:          ${dps}\neps:          ${this.moves.power}\nTimeout: ${this.moves.time}\n\n${this.moves.description}`;
      }
    }  else {
      //charge move without description
      if(this.moves.eps == 0) {
        sort = "charge";
        moveDescription = `Bars:        ${this.moves.bars}\nPower:     ${this.moves.power}\nTimeout: ${this.moves.time}`;

      //fast move without description
      } else {
        moveDescription = `dps:          ${dps}\neps:          ${this.moves.power}\nTimeout: ${this.moves.time}`;
      }
    }

    const embed = new Discord.MessageEmbed()
      .setTitle(`${this.moves.name} (${sort} attack)`)
      .setThumbnail(img)
      .setURL(url)
      .setColor(colors[this.moves.type])
      .setDescription(moveDescription);
    super.newMessage({embed});
  }
}

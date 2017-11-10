const Discord = require('discord.js');
const Message = require('./message');

module.exports = class GenericResponse extends Message {
  constructor(message) {
    super(message);


    if(this.startsWith('whosthatpokemon') || this.startsWith('wieisdezepokemon')) {

    let rand;

    //gen 1
    if(this.startsWith('whosthatpokemon gen 1') || this.startsWith('wieisdezepokemon gen 1') || this.startsWith('whosthatpokemon gen1') || this.startsWith('wieisdezepokemon gen1')) {
      rand = Math.floor(Math.random() * 151);
    }
   //gen 2
    else if(this.startsWith('whosthatpokemon gen 2') || this.startsWith('wieisdezepokemon gen 2') || this.startsWith('whosthatpokemon gen2') || this.startsWith('wieisdezepokemon gen2')) {
     rand = Math.floor(Math.random() * 251);
   }
   //gen 3
    else if(this.startsWith('whosthatpokemon gen 3') || this.startsWith('wieisdezepokemon gen 3') || this.startsWith('whosthatpokemon gen3') || this.startsWith('wieisdezepokemon gen3')) {
     rand = Math.floor(Math.random() * 386);
   }
   //gen 4
    else if(this.startsWith('whosthatpokemon gen 4') || this.startsWith('wieisdezepokemon gen 4') || this.startsWith('whosthatpokemon gen4') || this.startsWith('wieisdezepokemon gen4')) {
     rand = Math.floor(Math.random() * 493);
   }
   //gen 5
    else if(this.startsWith('whosthatpokemon gen 5') || this.startsWith('wieisdezepokemon gen 5') || this.startsWith('whosthatpokemon gen5') || this.startsWith('wieisdezepokemon gen5')) {
     rand = Math.floor(Math.random() * 649);
   }
   //gen 6
    else if(this.startsWith('whosthatpokemon gen 6') || this.startsWith('wieisdezepokemon gen 6') || this.startsWith('whosthatpokemon gen6') || this.startsWith('wieisdezepokemon gen6')) {
     rand = Math.floor(Math.random() * 721);
   }
   //gen 7
   else{
     rand = Math.floor(Math.random() * 802);
   }

   if (rand<10){
     rand = "00"+rand;
   }
   else if (rand<100){
     rand = "0"+rand;
   }

   const img = `https://i0.wp.com/delftmystic.files.wordpress.com/2017/11/silhouette-${rand}1.png`
   const embed = new Discord.MessageEmbed()
    .setTitle(`Who's That Pokémon?`)
    .setThumbnail(img)
   super.newMessage({embed});
    }


  }
}

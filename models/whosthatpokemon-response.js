const Discord = require('discord.js');
const Message = require('./message');

module.exports = class GenericResponse extends Message {
  constructor(message) {
    super(message);


    if(this.startsWith('whosthatpokemon') || this.startsWith('wieisdezepokemon')) {

    let rand;

    //gen 1
    if(this.startsWith('whosthatpokemon gen 1') || this.startsWith('wieisdezepokemon gen 1')) {
      rand = Math.floor(Math.random() * 151);
      console.log("\n1\n");
    }
   //gen 2
    else if(this.startsWith('whosthatpokemon gen 2') || this.startsWith('wieisdezepokemon gen 2')) {
     rand = Math.floor(Math.random() * 251);
     console.log("\n2\n");
   }
   //gen 3
    else if(this.startsWith('whosthatpokemon gen 3') || this.startsWith('wieisdezepokemon gen 3')) {
     rand = Math.floor(Math.random() * 386);
     console.log("\n3\n");
   }
   //gen 4
    else if(this.startsWith('whosthatpokemon gen 4') || this.startsWith('wieisdezepokemon gen 4')) {
     rand = Math.floor(Math.random() * 493);
   }
   //gen 5
    else if(this.startsWith('whosthatpokemon gen 5') || this.startsWith('wieisdezepokemon gen 5')) {
     rand = Math.floor(Math.random() * 649);
   }
   //gen 6
    else if(this.startsWith('whosthatpokemon gen 6') || this.startsWith('wieisdezepokemon gen 6')) {
     rand = Math.floor(Math.random() * 721);
   }
   //gen 7
   else{
     rand = Math.floor(Math.random() * 802);
     console.log("\n7\n");
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

'use strict';

var Discord = require('discord.js');
var client = new Discord.Client();
var https = require("https");
var settings = require("./settings.json")
const gyms = require('./data/gyms.json');
const stops = require('./data/pokestops.json');
const pokemons = require('./data/pokemons.json');
const defense = require('./data/defense.json');
client.login(settings.token);

var express = require('express');
var app = express();

const pokemonStats = require('./helpers/pokemon.js');

app.set('port', (process.env.PORT || 9222));

app.use(express.static(__dirname + '/public'));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));

  setInterval(function() {
    https.get("https://discord-pokemon.herokuapp.com/helloworld.html");
  }, 300000); // every 5 minutes (300000)
});

client.on('ready', () => {
  client.user.setGame('Pokemon Go');
  console.log('Blanche: I am ready!');
});


client.on("message", (msg) => {
  let prefixs = settings.prefixs;

  let moderator = settings.moderator;

  // get the first character of the message content
  let msgPrefix = msg.content[0];
  // get the message content, cut the first character, convert it to all lowercase and save to new variable
  var msgText = msg.content.toLowerCase().substr(1);

  if (prefixs.indexOf(msgPrefix) < 0 || msg.author.bot) return;

  //help
  if (msgText === 'help') {
    msg.channel.send(
      "Hey! Mijn naam is Blanche, en ik ben de teamleider van het beste team, Mystic! Naast het appraisen van jouw pokemon in game, kan ik jullie ook op discord assistentie verlenen. Ik reageer onder andere op de volgende commando's zolang ze zonder hoofdletters geschreven zijn:\n![pokemon]      voor info over raid bosses\n![gym naam]    voor de locatie van een gym\n!+[regio]           zie #speler_registratie"
    );
    msg.delete()
  } else

  // Request pokemon info test
  if (msgText === 'type') {
    msg.reply("Zie hier een tabel met type effectiviteit:", {
      file: "https://image.ibb.co/mxRthv/Untitled.png"
    });
    msg.delete()
  } else

  //justforlol
  if (msgText === 'mystic') {
    msg.channel.send(
      '**Team Mystic**\nI am Blanche, leader of Team Mystic. The wisdom of Pokémon is immeasurably deep. I am researching why it is that they evolve.\nMy team? With our calm analysis of overy situation, we cant lose!', {
        file: "https://pogosa.net/images/mystic_leader.png"
      });
    setTimeout(() => {
      msg.channel.send(
        'Wat een prachtige woorden vind je niet? Met onze wijsheid kunnen we samen met onze Pokémon elke uitdaging aan!'
      );;
    }, 1000);
    msg.delete()
  } else if (msgText === 'valor') {
    msg.channel.send(
      '**Team Valor**\nI am Candela, Tem Valor Leader!. Pokemon are stronger than humans, and they are warmhearted, too! I am researching ways to enhance Pokémon natural power in the pursuit of true strength. There is no doubt that the Pokémon in our team have trained are the strongest in battle! Are you ready?', {
        file: "https://pogosa.net/images/valor_leader.png"
      });
    setTimeout(() => {
      msg.channel.send(
        'Pokemon sterker dan mensen? Bij jullie team twijfel ik daar soms over.... Dat onderzoek van jullie om pokemon sterker te maken is in elk geval hard nodig bij team faler!'
      );;
    }, 1000);
    msg.delete()
  } else if (msgText === 'instinct') {
    msg.channel.send(
      '**Team Instinct**\nHey! The names Spark- the leader of Team Instinct. Pokémon are creatures with excellent intuition. I bet the secret to their intuition is related to how theyre hatched. Come on and join my team! You never lose when you trust your instincts!', {
        file: "https://pogosa.net/images/instinct_leader.png"
      });
    setTimeout(() => {
      msg.channel.send(
        'Vertrouwen op je intuitie? We leven toch zeker niet meer in de steentijd? En wat heeft hebben die eieren daar nu weer mee te maken? Met dit soort uitspraken lijkt het soms alsof je zelf uit een ei bent gekomen...'
      );;
    }, 1000);
    msg.delete()

  } else if (msgText === 'delft') {
    msg.reply(
      'Delft is het gebied waar wij proberen orde op zaken te stellen. Met de invasie van Candela en Spark hebben we flink werk aan de winkel. De gyms die we blauw willen houden, en de verschillende gebieden vanuit waar we dat organiseren zijn te vinden in: <https://www.google.com/maps/d/u/0/edit?mid=11DnpOBi-AsstZGT07NGO9txzxsU&ll=52.00888637739794%2C4.361529349999955&z=13>'
    );
  } else if (msgText === 'spoofer') {
    msg.reply(
      'Een spoofer is iemand die het een goed idee vind om dit spel vanaf de bank te spelen. Dit soort treurige personen die hun pokemon niet waard zijn manipuleren hun GPS om het spel te spelen. Report dit soort faalhazen hier:\n\n<https://support.pokemongo.nianticlabs.com/hc/en-us/requests/new?ticket_form_id=319948>\nMoge Niantics banhamer genadeloos zijn'
    );
    msg.delete()
  } else if (msgText === 'gyms') {
    msg.reply(
      'Hier is een kaart van alle gyms en regios in Delft, maak ze allemaal van ons! <https://www.google.com/maps/d/u/0/edit?mid=11DnpOBi-AsstZGT07NGO9txzxsU&ll=52.00888580917186%2C4.361529349999955&z=13>'
    );
    msg.delete()
  } else if (msgText === 'minortextfixes') {
    msg.reply(
      'Minor text fixes verwijst gekmakend naar het regelmatig incapabele niantic. Het is een referentie naar een van de eerste updates waar het spel bijzonder slecht functioneerde en iedereen aan het wachten was op optimalisaties. Na de lange tijd van wachten verscheen eindelijk de update, en de change log was: *minor text fixes*'
    );
    msg.delete()
  } else if (msgText === 'niantic') {
    msg.reply(
      'Niantic is het bedrijf dat Ingress 2 ontwikkelde en het Pokémon Go noemde. Door de gigantische populariteit van Pokémon is dit spel echter veel groter geworden, waardoor ze flink aan het groeien zijn.'
    );
    msg.delete()
  } else if (msgText === 'pokemon' || msgText ===
    'pokémon') {
    msg.reply(
      'Pokémon zijn de loslopende beestjes die je kunt vangen om ze voor de glorie van team Mystic tegen Valor en Instinct te laten strijden.'
    );
    msg.delete()
  } else if (msgText === 'weerbericht') {
    msg.reply(
      'Weer of geen weer, Valor en Instinct moeten uit hun gyms geschopt! Dus pak je revives, en ga ervoor! Articuno is niet voor niets de stormvogel!'
    );
    msg.delete()
  } else if (msgText === 'stats') {
    msg.reply(
      'Zoek je meer data van een pokemon dan ik je kan geven? Kijk hier eens rond! <https://pokemongo.gamepress.gg/pokemon-list>'
    );
    msg.delete()
  } else if (msgText === 'weerbericht') {
    msg.reply(
      'Weer of geen weer, Valor en Instinct moeten uit hun gyms geschopt! Dus pak je revives, en ga ervoor! Articuno is niet voor niets de stormvogel!'
    );
    msg.delete()
  } else if (msgText === 'tutorial') {
    msg.reply(
      'Pokémon go lijkt simpel, maar stiekem is het een best complex spel. Niet gevreesd, er is een hele tutorial voor geschreven! <https://delftmystic.wordpress.com/>'
    );
    msg.delete()
  } else if (msgText === 'iv' || msgText === 'ivs' ||
    msgText ===
    'IVs') {
    msg.reply(
      'Zoek je nauwkeurigere IV informatie dan ik je kan geven? Gebruik deze apps:\nVoor apple: <https://itunes.apple.com/us/app/poke-genie-for-pokemon-go-auto-iv-calculator/id1143920524?mt=8>\nVoor android: <https://play.google.com/store/apps/details?id=tesmath.calcy&hl=en>\nVoor android optie 2: <https://github.com/farkam135/GoIV/releases>'
    );
    msg.delete()
  } else if (msgText === 'nest') {
    msg.reply(
      'Naast de spawns die biome afhankelijk zijn heb je ook plekken die steeds dezelfde pokemon spawnen. Als je zon nest gevonden hebt of zoekt kun je dat hier aangeven: <https://thesilphroad.com/atlas#13.18/52.0073/4.3599>'
    );
    msg.delete()
  } else if (msgText === 'ash') {
    msg.reply(
      'Een trainer uit Palet Town waardoor alle Pokémon hype is begonnen. Als hij trouw was gebleven aan zijn goede pokemon had hij het waarschijnlijk ver geschopt, maar hij vond het blijkbaar leuker om steeds opnieuw te beginnen.'
    );
    msg.delete()
  } else {

    let pokemon = pokemons.find((p) => {

      if (!p.keys) {
        console.log('pokemon has no key', p);
        return;
      }
      return p.keys.find((key) => {
        return msgText == key;
      });
    });


    if (pokemon) {

      // dynamically compute defense values for type combinations
      let def = JSON.parse(JSON.stringify(defense[pokemon.type[0]]));
      for( var i = 1; i < pokemon.type.length; i++ )
      {
        for( var j = 0; j < def.length; j++ )
        {
          def[j].mult *= defense[pokemon.type[i]][j].mult;
        }
      }

      // filter for 1.96 and 1.4
      let verystrong = def.filter( (d) => { return d.mult > 1.5; });
      let strong = def.filter( (d) => { return (d.mult > 1.1 && d.mult < 1.5); });

      // compose message
      let reply = '**#' + pokemon.number + ' - ' + pokemon.name + '** [' + pokemon.type.join(', ') + ']\nWeakness:';
      if(verystrong.length > 0){
        reply += ' x1.96: [';
        for( var i = 0; i < verystrong.length; i++ ){ reply += verystrong[i].type; if(i < verystrong.length - 1){ reply += ", ";} }
        reply += ']';
      }
      if(strong.length > 0){
        reply += ' x1.4: [';
        for( var i = 0; i < strong.length; i++ ){ reply += strong[i].type; if(i < strong.length - 1){ reply += ", ";} }
        reply += ']';
      }
      // pokemon.recplayers can be used to identify whether the pokemon is also a raid boss
      if(pokemon.recplayers > 0){
        reply += '\nI recommend you battle ' + pokemon.name + ' with a group of ' + pokemon.recplayers + ' trainers.';
      }
      if(pokemon.attacks.length || pokemon.defence.length || pokemon.recplayers > 0){ reply += '```'; }
      if(pokemon.recplayers > 0){
        // needs to be computed
        let cpRange =  pokemonStats.cpRangeWonder(pokemon, 20);
        reply += 'Wonder CP: ' + cpRange[0] + ' - ' + cpRange[1] + '\n';
      }
      if(pokemon.attacks.length){ reply += 'Best Attacks: ' + pokemon.attacks[0] + ' & ' + pokemon.attacks[1] + '\n'; }
      if(pokemon.defence.length){ reply += 'Best Defense: ' + pokemon.defence[0] + ' & ' + pokemon.defence[1] + '\n'; }
      if(pokemon.attacks.length || pokemon.defence.length || pokemon.recplayers > 0){ reply += '```'; }

      msg.reply(reply);
    }

    const gymMatch = gyms.find((gym) => {
      if (!gym.keys) {
        console.log('gym has no key', gym);
        return;
      }

      return gym.keys.find((key) => {
        return msgText.startsWith(key);
      });
    });

    if (gymMatch) {
      msg.reply(`**Gym: ${gymMatch.reply}`);
    }

    //pokestop spins
    const stopMatch = stops.find((stop) => {
      return msgText.startsWith(stop.key);
    });

    if (stopMatch) {
      msg.reply(stopMatch.reply);
    }

    //give trusted role, admin only
    if (msgText.startsWith('add')) {
      if (msg.member.roles.has(moderator)) {
        let member = msg.mentions.members.first();
        let role = msg.guild.roles.find("name",
          "makingdelftblueagain");
        member.addRole(role).catch(console.error);
        msg.channel.send('Welkom ' + member +
          ', je bent nu officieel toegevoegd! In het kanaal #welkom is te lezen hoe deze discord werkt, lees dat dus vooral eens door! Daarnaast sta ik natuurlijk ook tot je beschikking! Door "!help" te typen kun je zien wat ik allemaal voor je kan doen! Verder zou het fijn zijn als je in deze discord dezelfde naam gebruikt als je pogo naam, zodat we weten wie iedereen is;)'
        );
      } else {
        msg.reply(
          'Leden verifieren kan alleen door een moderator worden gedaan'
        )
      }
      msg.delete()
    } else

    //request gym roles
    if (msgText.startsWith('+centrum')) {
      let role = msg.guild.roles.find("name", "Centrum");
      msg.member.addRole(role).catch(console.error);
      msg.reply('Je hebt nu toegang tot het centrum gym kanaal!');
      msg.delete()
    } else if (msgText.startsWith('+hoven')) {
      let role = msg.guild.roles.find("name", "Hoven");
      msg.member.addRole(role).catch(console.error);
      msg.reply('Je hebt nu toegang tot het hoven gym kanaal!');
      msg.delete()
    } else if (msgText.startsWith('+tu')) {
      let role = msg.guild.roles.find("name", "TU");
      msg.member.addRole(role).catch(console.error);
      msg.reply('Je hebt nu toegang tot het tu-wijk gym kanaal!');
      msg.delete()
    } else if (msgText.startsWith('+tanthof')) {
      let role = msg.guild.roles.find("name", "Tanthof");
      msg.member.addRole(role).catch(console.error);
      msg.reply('Je hebt nu toegang tot het tanthof gym kanaal!');
      msg.delete()
    } else if (msgText.startsWith('+noord')) {
      let role = msg.guild.roles.find("name", "DelftNoord");
      msg.member.addRole(role).catch(console.error);
      msg.reply('Je hebt nu toegang tot het Noord-Delft gym kanaal!');
      msg.delete()
    } else if (msgText.startsWith('+oost')) {
      let role = msg.guild.roles.find("name", "DelftOost");
      msg.member.addRole(role).catch(console.error);
      msg.reply('Je hebt nu toegang tot het Oost-Delft gym kanaal!');
      msg.delete()
    } else if (msgText.startsWith('+english')) {
      let role = msg.guild.roles.find("name", "English");
      msg.member.addRole(role).catch(console.error);
      msg.reply('You now have access to the English channel!');
      msg.delete()
    } else

    //remove gym roles
    if (msgText.startsWith('-centrum')) {
      let role = msg.guild.roles.find("name", "Centrum");
      msg.member.removeRole(role).catch(console.error);
      msg.reply(
        'Je hebt nu geen toegang meer tot het centrum gym kanaal!');
      msg.delete()
    } else if (msgText.startsWith('-hoven')) {
      let role = msg.guild.roles.find("name", "Hoven");
      msg.member.removeRole(role).catch(console.error);
      msg.reply(
        'Je hebt nu geen toegang meer tot het hoven gym kanaal!');
      msg.delete()
    } else if (msgText.startsWith('-tu')) {
      let role = msg.guild.roles.find("name", "TU");
      msg.member.removeRole(role).catch(console.error);
      msg.reply(
        'Je hebt nu geen toegang meer tot het tu-wijk gym kanaal!');
      msg.delete()
    } else if (msgText.startsWith('-tanthof')) {
      let role = msg.guild.roles.find("name", "Tanthof");
      msg.member.removeRole(role).catch(console.error);
      msg.reply(
        'Je hebt nu geen toegang meer tot het tanthof gym kanaal!');
      msg.delete()
    } else if (msgText.startsWith('-noord')) {
      let role = msg.guild.roles.find("name", "DelftNoord");
      msg.member.removeRole(role).catch(console.error);
      msg.reply(
        'Je hebt nu geen toegang meer tot het Noord-Delft gym kanaal!');
      msg.delete()
    } else if (msgText.startsWith('-oost')) {
      let role = msg.guild.roles.find("name", "DelftOost");
      msg.member.removeRole(role).catch(console.error);
      msg.reply(
        'Je hebt nu geen toegang meer tot het Oost-Delft gym kanaal!');
      msg.delete()
    } else if (msgText.startsWith('-english')) {
      let role = msg.guild.roles.find("name", "English");
      msg.member.removeRole(role).catch(console.error);
      msg.reply('You now have lost access to the English channel!');
      msg.delete()
    } else

    //delete msgs

    if (msgText.startsWith('delete')) {
      if (msg.member.roles.has(moderator)) {
        var del = msgText.split(" ");
        del.splice(0, 1);
        msg.channel.bulkDelete(del);
      } else {
        msg.reply('Alleen moderators kunnen berichten verwijderen')
      }
      msg.delete()
    } else {
      if (msgText === "!test") {
        msg.reply("Alles lijkt te werken!")
      }
      ;
    }
  }
});

//welcome new users

client.on('guildMemberAdd', member => {
  setTimeout(() => {
    member.guild.defaultChannel.send(
      `Welkom op de Mystic Delft Discord en leuk dat je onze groep wilt versterken, ${member}!
Om toegang te krijgen tot de volledige groep vragen wij een screenshot van je pokemon go profiel (dat is waar je naast je buddy staat). Als je deze kan uploaden zal een van de moderators je zo snel mogelijk te woord staan.

Welcome to our Mystic Delft Discord group, ${member}!
In order to get full access to our server, we would like to verify you are indeed mystic. If  you would be so kind as to upload a screenshot of your Pokémon Go profile (where you are standing next to your buddy) one of our moderators will contact you as soon as possible.`
    );
  }, 1000);
});

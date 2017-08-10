'use strict';

var Discord = require('discord.js');
var client = new Discord.Client();
var https = require("https");
var settings = require("./settings.json")
const gyms = require('./data/gyms.json');
const stops = require('./data/pokestops.json')
const pokemons = require('./data/pokemons.json');
const defense = require('./data/defense.json')
client.login(settings.token);

var express = require('express');
var app = express();

const text = require('./helpers/text.js');

app.set('port', (process.env.PORT || 9222));

app.use(express.static(__dirname + '/public'));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));


  setInterval(function() {
    https.get("https://discord-pokemon.herokuapp.com/helloworld.html");
  }, 300000); // every 5 minutes (300000)
});

client.on('ready', () => {
  console.log('Blanche: I am ready!');
});

client.on("message", (message) => {
  let prefix = settings.prefix;
  let moderator = settings.moderator;

  var msg_prefix = message.content[0];
  if (!prefix.indexOf(msg_prefix) < 0 || message.author.bot) return;

  var msg = message.content.toLowerCase().substr(1);

  //help
  if (msg === 'help') {
    message.reply(
      "Hey! Mijn naam is Blanche, en ik ben de teamleider van het beste team, Mystic! Naast het appraisen van jouw pokemon in game, kan ik jullie ook op discord assistentie verlenen. Ik reageer onder andere op de volgende commando's zolang ze zonder hoofdletters geschreven zijn:\n![pokemon]      voor info over raid bosses\n![gym naam]    voor de locatie van een gym\n!+[regio]           zie #speler_registratie"
    );
    message.delete()
  } else

  // Request pokemon info
  if (msg === 'type') {
    message.reply("Zie hier een tabel met type effectiviteit:", {
      file: "https://image.ibb.co/mxRthv/Untitled.png"
    });
    message.delete()
  } else

  //justforlol
  if (msg === 'mystic') {
    message.channel.send(
      '**Team Mystic**\nI am Blanche, leader of Team Mystic. The wisdom of Pokémon is immeasurably deep. I am researching why it is that they evolve.\nMy team? With our calm analysis of overy situation, we cant lose!', {
        file: "https://pogosa.net/images/mystic_leader.png"
      });
    setTimeout(() => {
      message.channel.send(
        'Wat een prachtige woorden vind je niet? Met onze wijsheid kunnen we samen met onze Pokémon elke uitdaging aan!'
      );;
    }, 1000);
    message.delete()
  } else if (msg === 'valor') {
    message.channel.send(
      '**Team Valor**\nI am Candela, Tem Valor Leader!. Pokemon are stronger than humans, and they are warmhearted, too! I am researching ways to enhance Pokémon natural power in the pursuit of true strength. There is no doubt that the Pokémon in our team have trained are the strongest in battle! Are you ready?', {
        file: "https://pogosa.net/images/valor_leader.png"
      });
    setTimeout(() => {
      message.channel.send(
        'Pokemon sterker dan mensen? Bij jullie team twijfel ik daar soms over.... Dat onderzoek van jullie om pokemon sterker te maken is in elk geval hard nodig bij team faler!'
      );;
    }, 1000);
    message.delete()
  } else if (msg === 'instinct') {
    message.channel.send(
      '**Team Instinct**\nHey! The names Spark- the leader of Team Instinct. Pokémon are creatures with excellent intuition. I bet the secret to their intuition is related to how theyre hatched. Come on and join my team! You never lose when you trust your instincts!', {
        file: "https://pogosa.net/images/instinct_leader.png"
      });
    setTimeout(() => {
      message.channel.send(
        'Vertrouwen op je intuitie? We leven toch zeker niet meer in de steentijd? En wat heeft hebben die eieren daar nu weer mee te maken? Met dit soort uitspraken lijkt het soms alsof je zelf uit een ei bent gekomen...'
      );;
    }, 1000);
    message.delete()

  } else if (msg === 'delft') {
    message.reply(
      'Delft is het gebied waar wij proberen orde op zaken te stellen. Met de invasie van Candela en Spark hebben we flink werk aan de winkel. De gyms die we blauw willen houden, en de verschillende gebieden vanuit waar we dat organiseren zijn te vinden in: <https://www.google.com/maps/d/u/0/edit?mid=11DnpOBi-AsstZGT07NGO9txzxsU&ll=52.00888637739794%2C4.361529349999955&z=13>'
    );
  } else if (msg === 'spoofer') {
    message.reply(
      'Een spoofer is iemand die het een goed idee vind om dit spel vanaf de bank te spelen. Dit soort treurige personen die hun pokemon niet waard zijn manipuleren hun GPS om het spel te spelen. Report dit soort faalhazen hier:\n\n<https://support.pokemongo.nianticlabs.com/hc/en-us/requests/new?ticket_form_id=319948>\nMoge Niantics banhamer genadeloos zijn'
    );
    message.delete()
  } else if (msg === 'gyms') {
    message.reply(
      'Hier is een kaart van alle gyms en regios in Delft, maak ze allemaal van ons! <https://www.google.com/maps/d/u/0/edit?mid=11DnpOBi-AsstZGT07NGO9txzxsU&ll=52.00888580917186%2C4.361529349999955&z=13>'
    );
    message.delete()
  } else if (msg === 'minortextfixes') {
    message.reply(
      'Minor text fixes verwijst gekmakend naar het regelmatig incapabele niantic. Het is een referentie naar een van de eerste updates waar het spel bijzonder slecht functioneerde en iedereen aan het wachten was op optimalisaties. Na de lange tijd van wachten verscheen eindelijk de update, en de change log was: *minor text fixes*'
    );
    message.delete()
  } else if (msg === 'niantic') {
    message.reply(
      'Niantic is het bedrijf dat Ingress 2 ontwikkelde en het Pokémon Go noemde. Door de gigantische populariteit van Pokémon is dit spel echter veel groter geworden, waardoor ze flink aan het groeien zijn.'
    );
    message.delete()
  } else if (msg === 'pokemon' || msg ===
    '!pokémon') {
    message.reply(
      'Pokémon zijn de loslopende beestjes die je kunt vangen om ze voor de glorie van team Mystic tegen Valor en Instinct te laten strijden.'
    );
    message.delete()
  } else if (msg === 'weerbericht') {
    message.reply(
      'Weer of geen weer, Valor en Instinct moeten uit hun gyms geschopt! Dus pak je revives, en ga ervoor! Articuno is niet voor niets de stormvogel!'
    );
    message.delete()
  } else if (msg === 'stats') {
    message.reply(
      'Zoek je meer data van een pokemon dan ik je kan geven? Kijk hier eens rond! <https://pokemongo.gamepress.gg/pokemon-list>'
    );
    message.delete()
  } else if (msg === 'tutorial') {
    message.reply(
      'Pokémon go lijkt simpel, maar stiekem is het een best complex spel. Niet gevreesd, er is een hele tutorial voor geschreven! <https://delftmystic.wordpress.com/>'
    );
    message.delete()
  } else if (msg === 'iv' || msg === 'ivs' ) {
    message.reply(
      'Zoek je nauwkeurigere IV informatie dan ik je kan geven? Gebruik deze apps:\nVoor apple: <https://itunes.apple.com/us/app/poke-genie-for-pokemon-go-auto-iv-calculator/id1143920524?mt=8>\nVoor android: <https://play.google.com/store/apps/details?id=tesmath.calcy&hl=en>\nVoor android optie 2: <https://github.com/farkam135/GoIV/releases>'
    );
    message.delete()
  } else if (msg === 'nest') {
    message.reply(
      'Naast de spawns die biome afhankelijk zijn heb je ook plekken die steeds dezelfde pokemon spawnen. Als je zon nest gevonden hebt of zoekt kun je dat hier aangeven: <https://thesilphroad.com/atlas#13.18/52.0073/4.3599>'
    );
    message.delete()
  } else if (msg === 'ash') {
    message.reply(
      'Een trainer uit Palet Town waardoor alle Pokémon hype is begonnen. Als hij trouw was gebleven aan zijn goede pokemon had hij het waarschijnlijk ver geschopt, maar hij vond het blijkbaar leuker om steeds opnieuw te beginnen.'
    );
    message.delete()
  } else {

    const pokemon = pokemons.find((p) => {
      if (!p.keys) {
        console.log('pokemon has no key', p);
        return;
      }

      return p.keys.find((key) => {
        return msg == key;
      });
    });


    if (pokemon) {

      // dynamically compute defense values for type combinations
      var def = JSON.parse(JSON.stringify(defense[pokemon.type[0]]));
      for( var i = 1; i < pokemon.type.length; i++ )
      {
        for( var j = 0; j < def.length; j++ )
        {
          def[j].mult *= defense[pokemon.type[i]][j].mult;
        }
      }

      // filter for 1.96 and 1.4
      var verystrong = def.filter( (d) => { return d.mult > 1.5; });
      var strong = def.filter( (d) => { return (d.mult > 1.1 && d.mult < 1.5); });

      // compose message
      var reply = '**#' + pokemon.number + ' - ' + pokemon.name + '** [' + pokemon.type.join(', ') + ']\nWeakness:';
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
      if(pokemon.recplayers > 0 ){ reply += '\nI recommend you battle ' + pokemon.name + ' with a group of ' + pokemon.recplayers + ' trainers.'; }
      // needs to be computed
      //reply += '\nWonder CP: ' + pokemon.wonder[0] + ' - ' + pokemon.wonder[1] + '\n';
      if(pokemon.attacks.length || pokemon.defence.length){ reply += '```'; }
      if(pokemon.attacks.length){ reply += 'Best Attacks: ' + pokemon.attacks[0] + ' & ' + pokemon.attacks[1] + '\n'; }
      if(pokemon.defence.length){ reply += 'Best Defense: ' + pokemon.defence[0] + ' & ' + pokemon.defence[1] + '\n'; }
      if(pokemon.attacks.length || pokemon.defence.length){ reply += '```'; }

      message.reply(reply);
    }


    const gymMatch = gyms.find((gym) => {
      if (!gym.keys) {
        console.log('gym has no key', gym);
        return;
      }

      return gym.keys.find((key) => {
        return msg.startsWith(key);
      });
    });

    if (gymMatch) {
      message.reply(`**Gym: ${gymMatch.reply}`);
    }

    //pokestop spins
    const stopMatch = stops.find((stop) => {
      return msg.startsWith(stop.key);
    });

    if (stopMatch) {
      message.reply(stopMatch.reply);
    }

    //give trusted role, admin only
    if (msg.startsWith('add')) {
      if (message.member.roles.has(moderator)) {
        let member = message.mentions.members.first();
        let role = message.guild.roles.find("name", "makingdelftblueagain");
        member.addRole(role).catch(console.error);
        message.channel.send('Welkom ' + member +
          ', je bent nu officieel toegevoegd! In het kanaal #welkom is te lezen hoe deze discord werkt, lees dat dus vooral eens door! Daarnaast sta ik natuurlijk ook tot je beschikking! Door "!help" te typen kun je zien wat ik allemaal voor je kan doen! Verder zou het fijn zijn als je in deze discord dezelfde naam gebruikt als je pogo naam, zodat we weten wie iedereen is;)'
        );
      } else {
        message.reply(
          'Leden verifieren kan alleen door een moderator worden gedaan')
      }
      message.delete()
    } else

    //request gym roles
    if (msg.startsWith('+centrum')) {
      let role = message.guild.roles.find("name", "Centrum");
      message.member.addRole(role).catch(console.error);
      message.reply('Je hebt nu toegang tot het centrum gym kanaal!');
      message.delete()
    } else if (msg.startsWith('+hoven')) {
      let role = message.guild.roles.find("name", "Hoven");
      message.member.addRole(role).catch(console.error);
      message.reply('Je hebt nu toegang tot het hoven gym kanaal!');
      message.delete()
    } else if (msg.startsWith('+tu')) {
      let role = message.guild.roles.find("name", "TU");
      message.member.addRole(role).catch(console.error);
      message.reply('Je hebt nu toegang tot het tu-wijk gym kanaal!');
      message.delete()
    } else if (msg.startsWith('+tanthof')) {
      let role = message.guild.roles.find("name", "Tanthof");
      message.member.addRole(role).catch(console.error);
      message.reply('Je hebt nu toegang tot het tanthof gym kanaal!');
      message.delete()
    } else if (msg.startsWith('+noord')) {
      let role = message.guild.roles.find("name", "DelftNoord");
      message.member.addRole(role).catch(console.error);
      message.reply('Je hebt nu toegang tot het Noord-Delft gym kanaal!');
      message.delete()
    } else if (msg.startsWith('+oost')) {
      let role = message.guild.roles.find("name", "DelftOost");
      message.member.addRole(role).catch(console.error);
      message.reply('Je hebt nu toegang tot het Oost-Delft gym kanaal!');
      message.delete()
    } else if (msg.startsWith('+english')) {
      let role = message.guild.roles.find("name", "English");
      message.member.addRole(role).catch(console.error);
      message.reply('You now have access to the English channel!');
      message.delete()
    } else

    //remove gym roles
    if (msg.startsWith('-centrum')) {
      let role = message.guild.roles.find("name", "Centrum");
      message.member.removeRole(role).catch(console.error);
      message.reply(
        'Je hebt nu geen toegang meer tot het centrum gym kanaal!');
      message.delete()
    } else if (msg.startsWith('-hoven')) {
      let role = message.guild.roles.find("name", "Hoven");
      message.member.removeRole(role).catch(console.error);
      message.reply(
        'Je hebt nu geen toegang meer tot het hoven gym kanaal!');
      message.delete()
    } else if (msg.startsWith('-tu')) {
      let role = message.guild.roles.find("name", "TU");
      message.member.removeRole(role).catch(console.error);
      message.reply(
        'Je hebt nu geen toegang meer tot het tu-wijk gym kanaal!');
      message.delete()
    } else if (msg.startsWith('-tanthof')) {
      let role = message.guild.roles.find("name", "Tanthof");
      message.member.removeRole(role).catch(console.error);
      message.reply(
        'Je hebt nu geen toegang meer tot het tanthof gym kanaal!');
      message.delete()
    } else if (msg.startsWith('-noord')) {
      let role = message.guild.roles.find("name", "DelftNoord");
      message.member.removeRole(role).catch(console.error);
      message.reply(
        'Je hebt nu geen toegang meer tot het Noord-Delft gym kanaal!');
      message.delete()
    } else if (msg.startsWith('-oost')) {
      let role = message.guild.roles.find("name", "DelftOost");
      message.member.removeRole(role).catch(console.error);
      message.reply(
        'Je hebt nu geen toegang meer tot het Oost-Delft gym kanaal!');
      message.delete()
    } else if (msg.startsWith('-english')) {
      let role = message.guild.roles.find("name", "English");
      message.member.removeRole(role).catch(console.error);
      message.reply('You now have lost access to the English channel!');
      message.delete()
    } else

    //delete messages

    if (msg.startsWith('delete')) {
      if (message.member.roles.has(moderator)) {
        var del = msg.split(" ");
        del.splice(0, 1);
        message.channel.bulkDelete(del);
      } else {
        message.reply('Alleen moderators kunnen berichten verwijderen')
      }
      message.delete()
    }
    else {
        if (msg === "test") {message.reply("Alles lijkt te werken!")};}
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

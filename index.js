'use strict';

var Discord = require('discord.js');
var client = new Discord.Client();
var https = require("https");
var settings = require("./settings.json")
const gyms = require('./data/gyms.json');
const stops = require('./data/pokestops.json')
client.login(settings.token);

var express = require('express');
var app = express();


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



client.on("message", (message) => {
  let prefix = settings.prefix;
  let moderator = settings.moderator;
  if (message.content.includes('blanche')) {
    const replies = [
      'Hé hoorde ik daar mijn naam?',
      'Wat wil je weten?',
      'Ja ik ben online :)',
      'Dame blanche he voor jou ;)'
    ]
    const reply = replies[Math.floor(Math.random() * replies.length)];
    message.reply(reply);
  }

  if (!message.content.startsWith(prefix) || message.author.bot) return;


  //help
  if (message.content === '!help') {
    message.reply(
      "Hey! Mijn naam is Blanche, en ik ben de teamleider van het beste team, Mystic! Naast het appraisen van jouw pokemon in game, kan ik jullie ook op discord assistentie verlenen. Ik reageer onder andere op de volgende commando's zolang ze zonder hoofdletters geschreven zijn:\n![pokemon]      voor info over raid bosses\n![gym naam]    voor de locatie van een gym\n!+[regio]           zie #speler_registratie"
    );
    message.delete()
  } else

  // Request pokemon info
  if (message.content === '!type') {
    message.reply("Zie hier een tabel met type effectiviteit:", {
      file: "https://image.ibb.co/mxRthv/Untitled.png"
    });
    message.delete()
  } else if (message.content === '!charizard') {
    message.reply(
      '**#3 - Charizard** [Fire Flying]\nweakness: x1.96 [Rock] x1.4: [Electric Water]\nWonder CP: 1498 - 1535 \n```Att: Fire Spin Overheat```'
    );
    message.delete()
  } else if (message.content === '!venusaur') {
    message.reply(
      '**#6 - Venusaur** [Grass Poison]\nweakness: x1.4: [Fire Flying Ice Psychic]\nWonder CP: 1434 - 1467 \n```Att: Vine Whip Solar Beam```'
    );
    message.delete()
  } else if (message.content === '!blastoise') {
    message.reply(
      '**#9 - Blastoise** [Water]\nweakness: x1.4: [electric Grass]\nWonder CP: 1280 - 1309 \n```Att: Water Gun Hydro Pump```'
    );
    message.delete()
  } else if (message.content === '!alakazam') {
    message.reply(
      '**#65 - Alakazam** [Psychic]\nweakness: x1.4: [dark bug]\nWonder CP: 1608 - 1649 \n```Att: Psycho Cut  Future Sight```'
    );
    message.delete()
  } else if (message.content === '!machamp') {
    message.reply(
      '**#68 - Machamp** [Fighting]\nweakness: x1.4: [Fairy Flying Psychic]\nWonder CP: 1612 - 1649 \n```Att: Counter   Dynamic Punch```'
    );
    message.delete()
  } else if (message.content === '!muk') {
    message.reply(
      '**#89 - Muk** [Poison]\nweakness: x1.4: [Ground Psychic]\nWonder CP: 1517 - 1548 \n```Att&Def: Poison Jab Gunk Shot```'
    );
    message.delete()
  } else if (message.content === '!gengar') {
    message.reply(
      '**#94 - Gengar** [Ghost Poison]\nweakness: x1.4: [Dark Ground Ghost Psychic]\nWonder CP: 1454 - 1496 \n```Att: Hex  Shadow Ball```'
    );
    message.delete()
  } else if (message.content === '!magikarp') {
    message.reply(
      '**#103 - Magikarp** [Water]\nweakness: alles\nWonder CP: 119 - 125 \n```Att: Splash  Struggle```'
    );
    message.delete()
  } else if (message.content === '!weezing') {
    message.reply(
      '**#136 - Weezing** [Poison]\nweakness: x1.4: [Ground Psychic]\nWonder CP: 1218 - 1247 \n```Att&Def: Infestation Sludge Bomb```'
    );
    message.delete()
  } else if (message.content === '!rhydon') {
    message.reply(
      '**#112 - Rhydon** [Ground Rock]\nweakness: x1.96 [Grass Water] x1.4: [Ground Steel Fighting Ice]\nWonder CP: 1849 - 1886 \n```Att: Mud Slap Earthquake/Stone Edge```'
    );
    message.delete()
  } else if (message.content === '!electabuzz') {
    message.reply(
      '**#125 - Electabuzz** [Electric]\nweakness: x1.4: [Ground]\nWonder CP: 1222 - 1255 \n```Att: Thunder Shock Thunderbolt\n```'
    );
    message.delete()
  } else if (message.content === '!magmar') {
    message.reply(
      '**#136 - Magmar** [Fire]\nweakness: x1.4: [Rock Ground Water]\nWonder CP: 1254 - 1288 \n```Att: Ember Flamethrower```'
    );
    message.delete()
  } else if (message.content === '!exeggutor') {
    message.reply(
      '**#129 - Exeggutor** [Grass Psychic]\nweakness: x1.96 [Bug] x1.4: [Fire Dark Flying oison Ghost Ice]\nWonder CP: 1628 - 1666 \n```Att: Bullet Seed   Solar Beam\nDef: Extrasensory Solar Beam```'
    );
    message.delete()
  } else if (message.content === '!lapras') {
    message.reply(
      '**#131 - Lapras** [Ice Water]\nweakness: x1.4: [electric Grass Rock Fighting]\nWonder CP: 1459 - 1487 \n```Att: Frost Breath  Blizzard\n\nDef: Frost Breath  Ice Beam```'
    );
    message.delete()
  } else if (message.content === '!vaporeon') {
    message.reply(
      '**#134 - Vaporeon** [Water]\nweakness: x1.4: [electric Grass]\nWonder CP: 1769 - 1804 \n```Att: Water Gun  Hydro Pump```'
    );
    message.delete()
  } else if (message.content === '!jolteon') {
    message.reply(
      '**#135 - Jolteon** [Ground]\nweakness: x1.4: []\nWonder CP: 1520 - 1560 \n```Att: Thunder Shock Thunderbolt\n\nDef: Volt Switch Discharge```'
    );
    message.delete()
  } else if (message.content === '!flareon') {
    message.reply(
      '**#136 - Flareon** [Fire]\nweakness: x1.4: [Rock Ground Water]\nWonder CP: 1619 - 1659 \n```Att: Fire Spin Overheat\n\nDef: Fire Spin Flamethrower```'
    );
    message.delete()
  } else if (message.content === '!snorlax') {
    message.reply(
      '**#143 - Snorlax** [Normal]\nweakness: x1.4: [Fighting]\nWonder CP: 1885 - 1917 \n```Def: Zen Headbutt  Heavy Slam```'
    );
    message.delete()
  } else if (message.content === '!articuno') {
    message.reply(
      '**#144 - Articuno** [Ice Flying]\nweakness: x1.96: [Rock] x1.4: [Electric Fire Steel]\nWonder CP: 1644 - 1676 \n```Att: Frost Breath    Blizzard```'
    );
    message.delete()
  } else if (message.content === '!zapdos') {
    message.reply(
      '**#145 - Zapdos** [Electric Flying]\nweakness: x1.4: [Rock Ice]\nWonder CP: 1861 - 1902 \n```Att: Charge Beam    Thunderbolt```'
    );
    message.delete()
  } else if (message.content === '!moltres') {
    message.reply(
      '**#146 - Moltres** [Fire Flying]\nweakness: x1.96: [Rock] x1.4: [Water]\nWonder CP: 1828 - 1870 \n```Att: Fire Spin    Overheat```'
    );
    message.delete()
  } else if (message.content === '!quilava') {
    message.reply(
      '**#156 - Quilava** [Fire]\nweakness: x1.4: [Rock Ground Water]\nWonder CP: 821 - 847'
    );
    message.delete()
  } else if (message.content === '!croconaw') {
    message.reply(
      '**#159 - Croconaw** [Water]\nweakness: x1.4: [electric Grass]\nWonder CP: 888 - 913'
    );
    message.delete()
  } else if (message.content === '!bayleef') {
    message.reply(
      '**#153 - Bayleef** [Grass]\nweakness: x1.4: [Bug Fire Flying Poison Ice]\nWonder CP: 719 - 740'
    );
    message.delete()
  } else if (message.content === '!shuckle') {
    message.reply(
      '**#213 - Shuckle** [Bug Rock]\nweakness: x1.4: [Rock Steel Water]\nWonder CP: 165 - 171 \n```Att: Rock Throw Stone Edge```\nIk geef verder nog hetvolgende advies:\nDONT FUCKLE WITH SHUCKLE'
    );
    message.delete()
  } else if (message.content === '!tyranitar' || message.content ===
    '!ttar') {
    message.reply(
      '**#248 - Tyranitar** [Dark Rock]\nweakness: x1.96: [Fighting] x1.4: [Bug Grass Fairy Ground Steel Water]\nWonder CP: 2055 - 2097 \n```Att: Bite Stone Edge```'
    );
    message.delete()
  } else if (message.content === '!lugia') {
    message.reply(
      '**#249 - Lugia** [Psychic Flying]\nweakness: x1.4: [Electric Rock Dark Ghost Ice]\nWonder CP: 2023 - 2053 \n```Att: Extrasensory    Sky Attack \nAtt: Extrasensory    Future Sight```'
    );
    message.delete()
  } else if (message.content === '!ho-oh' || message.content === '!ho oh') {
    message.reply(
      '**#250 - Ho-Oh** [Fire Flying]\nweakness: x1.96: [Rock] x1.4: [Electric Water]\nWonder CP: 2613 - 2657 \n```Att: ???```'
    );
    message.delete()
  } else if (message.content === '!missingno') {
    message.reply(
      '**# けつばん - Missingno** [Normal 999]\nweakness: x1.4: [Fighting]\nWonder CP: 0x5E - 0xB5  \n```Att: Water Gun Sky Attack```\n'
    );
    message.delete()
  } else

  //justforlol
  if (message.content === '!mystic') {
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
  } else if (message.content === '!valor') {
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
  } else if (message.content === '!instinct') {
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

  } else if (message.content === '!delft') {
    message.reply(
      'Delft is het gebied waar wij proberen orde op zaken te stellen. Met de invasie van Candela en Spark hebben we flink werk aan de winkel. De gyms die we blauw willen houden, en de verschillende gebieden vanuit waar we dat organiseren zijn te vinden in: <https://www.google.com/maps/d/u/0/edit?mid=11DnpOBi-AsstZGT07NGO9txzxsU&ll=52.00888637739794%2C4.361529349999955&z=13>'
    );
  } else if (message.content === '!spoofer') {
    message.reply(
      'Een spoofer is iemand die het een goed idee vind om dit spel vanaf de bank te spelen. Dit soort treurige personen die hun pokemon niet waard zijn manipuleren hun GPS om het spel te spelen. Report dit soort faalhazen hier:\n\n<https://support.pokemongo.nianticlabs.com/hc/en-us/requests/new?ticket_form_id=319948>\nMoge Niantics banhamer genadeloos zijn'
    );
    message.delete()
  } else if (message.content === '!gyms') {
    message.reply(
      'Hier is een kaart van alle gyms en regios in Delft, maak ze allemaal van ons! <https://www.google.com/maps/d/u/0/edit?mid=11DnpOBi-AsstZGT07NGO9txzxsU&ll=52.00888580917186%2C4.361529349999955&z=13>'
    );
    message.delete()
  } else if (message.content === '!minortextfixes') {
    message.reply(
      'Minor text fixes verwijst gekmakend naar het regelmatig incapabele niantic. Het is een referentie naar een van de eerste updates waar het spel bijzonder slecht functioneerde en iedereen aan het wachten was op optimalisaties. Na de lange tijd van wachten verscheen eindelijk de update, en de change log was: *minor text fixes*'
    );
    message.delete()
  } else if (message.content === '!niantic') {
    message.reply(
      'Niantic is het bedrijf dat Ingress 2 ontwikkelde en het Pokémon Go noemde. Door de gigantische populariteit van Pokémon is dit spel echter veel groter geworden, waardoor ze flink aan het groeien zijn.'
    );
    message.delete()
  } else if (message.content === '!pokemon' || message.content ===
    '!pokémon') {
    message.reply(
      'Pokémon zijn de loslopende beestjes die je kunt vangen om ze voor de glorie van team Mystic tegen Valor en Instinct te laten strijden.'
    );
    message.delete()
  } else if (message.content === '!weerbericht') {
    message.reply(
      'Weer of geen weer, Valor en Instinct moeten uit hun gyms geschopt! Dus pak je revives, en ga ervoor! Articuno is niet voor niets de stormvogel!'
    );
    message.delete()
  } else if (message.content === '!stats') {
    message.reply(
      'Zoek je meer data van een pokemon dan ik je kan geven? Kijk hier eens rond! <https://pokemongo.gamepress.gg/pokemon-list>'
    );
    message.delete()
  } else if (message.content === '!weerbericht') {
    message.reply(
      'Weer of geen weer, Valor en Instinct moeten uit hun gyms geschopt! Dus pak je revives, en ga ervoor! Articuno is niet voor niets de stormvogel!'
    );
    message.delete()
  } else if (message.content === '!tutorial') {
    message.reply(
      'Pokémon go lijkt simpel, maar stiekem is het een best complex spel. Niet gevreesd, er is een hele tutorial voor geschreven! <https://delftmystic.wordpress.com/>'
    );
    message.delete()
  } else if (message.content === '!iv' || message.content === '!ivs' ||
    message.content ===
    '!IVs') {
    message.reply(
      'Zoek je nauwkeurigere IV informatie dan ik je kan geven? Gebruik deze apps:\nVoor apple: <https://itunes.apple.com/us/app/poke-genie-for-pokemon-go-auto-iv-calculator/id1143920524?mt=8>\nVoor android: <https://play.google.com/store/apps/details?id=tesmath.calcy&hl=en>\nVoor android optie 2: <https://github.com/farkam135/GoIV/releases>'
    );
    message.delete()
  } else if (message.content === '!nest') {
    message.reply(
      'Naast de spawns die biome afhankelijk zijn heb je ook plekken die steeds dezelfde pokemon spawnen. Als je zon nest gevonden hebt of zoekt kun je dat hier aangeven: <https://thesilphroad.com/atlas#13.18/52.0073/4.3599>'
    );
    message.delete()
  } else if (message.content === '!ash') {
    message.reply(
      'Een trainer uit Palet Town waardoor alle Pokémon hype is begonnen. Als hij trouw was gebleven aan zijn goede pokemon had hij het waarschijnlijk ver geschopt, maar hij vond het blijkbaar leuker om steeds opnieuw te beginnen.'
    );
    message.delete()
  } else {
    const gymMatch = gyms.find((gym) => {
      if (!gym.keys) {
        console.log('gym has no key', gym);
        return;
      }

      return gym.keys.find((key) => {
        return message.content.startsWith(key);
      });
    });

    if (gymMatch) {
      message.reply(`**Gym: ${gymMatch.reply}`);
    }

    //pokestop spins
    const stopMatch = stops.find((stop) => {
      return message.content.startsWith(stop.key);
    });

    if (stopMatch) {
      message.reply(stopMatch.reply);
    }

    //give trusted role, admin only
    if (message.content.startsWith('!add')) {
      if (message.member.roles.has(moderator)) {
        let member = message.mentions.members.first();
        let role = message.guild.roles.find("name",
          "makingdelftblueagain");
        member.addRole(role).catch(console.error);
        message.channel.send('Welkom ' + member +
          ', je bent nu officieel toegevoegd! In het kanaal #welkom is te lezen hoe deze discord werkt, lees dat dus vooral eens door! Daarnaast sta ik natuurlijk ook tot je beschikking! Door "!help" te typen kun je zien wat ik allemaal voor je kan doen! Verder zou het fijn zijn als je in deze discord dezelfde naam gebruikt als je pogo naam, zodat we weten wie iedereen is;)'
        );
      } else {
        message.reply(
          'Leden verifieren kan alleen door een moderator worden gedaan'
        )
      }
      message.delete()
    } else

    //request gym roles
    if (message.content.startsWith('!+centrum')) {
      let role = message.guild.roles.find("name", "Centrum");
      message.member.addRole(role).catch(console.error);
      message.reply('Je hebt nu toegang tot het centrum gym kanaal!');
      message.delete()
    } else if (message.content.startsWith('!+hoven')) {
      let role = message.guild.roles.find("name", "Hoven");
      message.member.addRole(role).catch(console.error);
      message.reply('Je hebt nu toegang tot het hoven gym kanaal!');
      message.delete()
    } else if (message.content.startsWith('!+tu')) {
      let role = message.guild.roles.find("name", "TU");
      message.member.addRole(role).catch(console.error);
      message.reply('Je hebt nu toegang tot het tu-wijk gym kanaal!');
      message.delete()
    } else if (message.content.startsWith('!+tanthof')) {
      let role = message.guild.roles.find("name", "Tanthof");
      message.member.addRole(role).catch(console.error);
      message.reply('Je hebt nu toegang tot het tanthof gym kanaal!');
      message.delete()
    } else if (message.content.startsWith('!+noord')) {
      let role = message.guild.roles.find("name", "DelftNoord");
      message.member.addRole(role).catch(console.error);
      message.reply('Je hebt nu toegang tot het Noord-Delft gym kanaal!');
      message.delete()
    } else if (message.content.startsWith('!+oost')) {
      let role = message.guild.roles.find("name", "DelftOost");
      message.member.addRole(role).catch(console.error);
      message.reply('Je hebt nu toegang tot het Oost-Delft gym kanaal!');
      message.delete()
    } else if (message.content.startsWith('!+english')) {
      let role = message.guild.roles.find("name", "English");
      message.member.addRole(role).catch(console.error);
      message.reply('You now have access to the English channel!');
      message.delete()
    } else

    //remove gym roles
    if (message.content.startsWith('!-centrum')) {
      let role = message.guild.roles.find("name", "Centrum");
      message.member.removeRole(role).catch(console.error);
      message.reply(
        'Je hebt nu geen toegang meer tot het centrum gym kanaal!');
      message.delete()
    } else if (message.content.startsWith('!-hoven')) {
      let role = message.guild.roles.find("name", "Hoven");
      message.member.removeRole(role).catch(console.error);
      message.reply(
        'Je hebt nu geen toegang meer tot het hoven gym kanaal!');
      message.delete()
    } else if (message.content.startsWith('!-tu')) {
      let role = message.guild.roles.find("name", "TU");
      message.member.removeRole(role).catch(console.error);
      message.reply(
        'Je hebt nu geen toegang meer tot het tu-wijk gym kanaal!');
      message.delete()
    } else if (message.content.startsWith('!-tanthof')) {
      let role = message.guild.roles.find("name", "Tanthof");
      message.member.removeRole(role).catch(console.error);
      message.reply(
        'Je hebt nu geen toegang meer tot het tanthof gym kanaal!');
      message.delete()
    } else if (message.content.startsWith('!-noord')) {
      let role = message.guild.roles.find("name", "DelftNoord");
      message.member.removeRole(role).catch(console.error);
      message.reply(
        'Je hebt nu geen toegang meer tot het Noord-Delft gym kanaal!');
      message.delete()
    } else if (message.content.startsWith('!-oost')) {
      let role = message.guild.roles.find("name", "DelftOost");
      message.member.removeRole(role).catch(console.error);
      message.reply(
        'Je hebt nu geen toegang meer tot het Oost-Delft gym kanaal!');
      message.delete()
    } else if (message.content.startsWith('!-english')) {
      let role = message.guild.roles.find("name", "English");
      message.member.removeRole(role).catch(console.error);
      message.reply('You now have lost access to the English channel!');
      message.delete()
    } else

    //delete messages

    if (message.content.startsWith('!delete')) {
      if (message.member.roles.has(moderator)) {
        var del = message.content.split(" ");
        del.splice(0, 1);
        message.channel.bulkDelete(del);
      } else {
        message.reply('Alleen moderators kunnen berichten verwijderen')
      }
      message.delete()
    }
    else {
        if (message.content === "!test") {message.reply("Alles lijkt te werken!")};}
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

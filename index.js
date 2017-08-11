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
client.on("message", (msg) => {
  let prefixs = settings.prefixs;
  let moderator = settings.moderator;

  const havePrefix = prefixs.find((prefix) => {
    return msg.content.startsWith(prefix);
  })
  if (!havePrefix || msg.author.bot) return;

  //help
  if (msg.content === '!help') {
    msg.reply(
      "Hey! Mijn naam is Blanche, en ik ben de teamleider van het beste team, Mystic! Naast het appraisen van jouw pokemon in game, kan ik jullie ook op discord assistentie verlenen. Ik reageer onder andere op de volgende commando's zolang ze zonder hoofdletters geschreven zijn:\n![pokemon]      voor info over raid bosses\n![gym naam]    voor de locatie van een gym\n!+[regio]           zie #speler_registratie"
    );
    msg.delete()
  } else

  // Request pokemon info test
  if (msg.content === '!type') {
    msg.reply("Zie hier een tabel met type effectiviteit:", {
      file: "https://image.ibb.co/mxRthv/Untitled.png"
    });
    msg.delete()
  } else if (msg.content === '!charizard') {
    msg.reply(
      '**#3 - Charizard** [Fire Flying]\nweakness: x1.96 [Rock] x1.4: [Electric Water]\nWonder CP: 1498 - 1535 \n```Att: Fire Spin Overheat```'
    );
    msg.delete()
  } else if (msg.content === '!venusaur') {
    msg.reply(
      '**#6 - Venusaur** [Grass Poison]\nweakness: x1.4: [Fire Flying Ice Psychic]\nWonder CP: 1434 - 1467 \n```Att: Vine Whip Solar Beam```'
    );
    msg.delete()
  } else if (msg.content === '!blastoise') {
    msg.reply(
      '**#9 - Blastoise** [Water]\nweakness: x1.4: [electric Grass]\nWonder CP: 1280 - 1309 \n```Att: Water Gun Hydro Pump```'
    );
    msg.delete()
  } else if (msg.content === '!alakazam') {
    msg.reply(
      '**#65 - Alakazam** [Psychic]\nweakness: x1.4: [dark bug]\nWonder CP: 1608 - 1649 \n```Att: Psycho Cut  Future Sight```'
    );
    msg.delete()
  } else if (msg.content === '!machamp') {
    msg.reply(
      '**#68 - Machamp** [Fighting]\nweakness: x1.4: [Fairy Flying Psychic]\nWonder CP: 1612 - 1649 \n```Att: Counter   Dynamic Punch```'
    );
    msg.delete()
  } else if (msg.content === '!muk') {
    msg.reply(
      '**#89 - Muk** [Poison]\nweakness: x1.4: [Ground Psychic]\nWonder CP: 1517 - 1548 \n```Att&Def: Poison Jab Gunk Shot```'
    );
    msg.delete()
  } else if (msg.content === '!gengar') {
    msg.reply(
      '**#94 - Gengar** [Ghost Poison]\nweakness: x1.4: [Dark Ground Ghost Psychic]\nWonder CP: 1454 - 1496 \n```Att: Hex  Shadow Ball```'
    );
    msg.delete()
  } else if (msg.content === '!magikarp') {
    msg.reply(
      '**#103 - Magikarp** [Water]\nweakness: alles\nWonder CP: 119 - 125 \n```Att: Splash  Struggle```'
    );
    msg.delete()
  } else if (msg.content === '!weezing') {
    msg.reply(
      '**#136 - Weezing** [Poison]\nweakness: x1.4: [Ground Psychic]\nWonder CP: 1218 - 1247 \n```Att&Def: Infestation Sludge Bomb```'
    );
    msg.delete()
  } else if (msg.content === '!rhydon') {
    msg.reply(
      '**#112 - Rhydon** [Ground Rock]\nweakness: x1.96 [Grass Water] x1.4: [Ground Steel Fighting Ice]\nWonder CP: 1849 - 1886 \n```Att: Mud Slap Earthquake/Stone Edge```'
    );
    msg.delete()
  } else if (msg.content === '!electabuzz') {
    msg.reply(
      '**#125 - Electabuzz** [Electric]\nweakness: x1.4: [Ground]\nWonder CP: 1222 - 1255 \n```Att: Thunder Shock Thunderbolt\n```'
    );
    msg.delete()
  } else if (msg.content === '!magmar') {
    msg.reply(
      '**#136 - Magmar** [Fire]\nweakness: x1.4: [Rock Ground Water]\nWonder CP: 1254 - 1288 \n```Att: Ember Flamethrower```'
    );
    msg.delete()
  } else if (msg.content === '!exeggutor') {
    msg.reply(
      '**#129 - Exeggutor** [Grass Psychic]\nweakness: x1.96 [Bug] x1.4: [Fire Dark Flying oison Ghost Ice]\nWonder CP: 1628 - 1666 \n```Att: Bullet Seed   Solar Beam\nDef: Extrasensory Solar Beam```'
    );
    msg.delete()
  } else if (msg.content === '!lapras') {
    msg.reply(
      '**#131 - Lapras** [Ice Water]\nweakness: x1.4: [electric Grass Rock Fighting]\nWonder CP: 1459 - 1487 \n```Att: Frost Breath  Blizzard\n\nDef: Frost Breath  Ice Beam```'
    );
    msg.delete()
  } else if (msg.content === '!vaporeon') {
    msg.reply(
      '**#134 - Vaporeon** [Water]\nweakness: x1.4: [electric Grass]\nWonder CP: 1769 - 1804 \n```Att: Water Gun  Hydro Pump```'
    );
    msg.delete()
  } else if (msg.content === '!jolteon') {
    msg.reply(
      '**#135 - Jolteon** [Ground]\nweakness: x1.4: []\nWonder CP: 1520 - 1560 \n```Att: Thunder Shock Thunderbolt\n\nDef: Volt Switch Discharge```'
    );
    msg.delete()
  } else if (msg.content === '!flareon') {
    msg.reply(
      '**#136 - Flareon** [Fire]\nweakness: x1.4: [Rock Ground Water]\nWonder CP: 1619 - 1659 \n```Att: Fire Spin Overheat\n\nDef: Fire Spin Flamethrower```'
    );
    msg.delete()
  } else if (msg.content === '!snorlax') {
    msg.reply(
      '**#143 - Snorlax** [Normal]\nweakness: x1.4: [Fighting]\nWonder CP: 1885 - 1917 \n```Def: Zen Headbutt  Heavy Slam```'
    );
    msg.delete()
  } else if (msg.content === '!articuno') {
    msg.reply(
      '**#144 - Articuno** [Ice Flying]\nweakness: x1.96: [Rock] x1.4: [Electric Fire Steel]\nWonder CP: 1644 - 1676 \n```Att: Frost Breath    Blizzard```'
    );
    msg.delete()
  } else if (msg.content === '!zapdos') {
    msg.reply(
      '**#145 - Zapdos** [Electric Flying]\nweakness: x1.4: [Rock Ice]\nWonder CP: 1861 - 1902 \n```Att: Charge Beam    Thunderbolt```'
    );
    msg.delete()
  } else if (msg.content === '!moltres') {
    msg.reply(
      '**#146 - Moltres** [Fire Flying]\nweakness: x1.96: [Rock] x1.4: [Water]\nWonder CP: 1828 - 1870 \n```Att: Fire Spin    Overheat```'
    );
    msg.delete()
  } else if (msg.content === '!quilava') {
    msg.reply(
      '**#156 - Quilava** [Fire]\nweakness: x1.4: [Rock Ground Water]\nWonder CP: 821 - 847'
    );
    msg.delete()
  } else if (msg.content === '!croconaw') {
    msg.reply(
      '**#159 - Croconaw** [Water]\nweakness: x1.4: [electric Grass]\nWonder CP: 888 - 913'
    );
    msg.delete()
  } else if (msg.content === '!bayleef') {
    msg.reply(
      '**#153 - Bayleef** [Grass]\nweakness: x1.4: [Bug Fire Flying Poison Ice]\nWonder CP: 719 - 740'
    );
    msg.delete()
  } else if (msg.content === '!shuckle') {
    msg.reply(
      '**#213 - Shuckle** [Bug Rock]\nweakness: x1.4: [Rock Steel Water]\nWonder CP: 165 - 171 \n```Att: Rock Throw Stone Edge```\nIk geef verder nog hetvolgende advies:\nDONT FUCKLE WITH SHUCKLE'
    );
    msg.delete()
  } else if (msg.content === '!tyranitar' || msg.content ===
    '!ttar') {
    msg.reply(
      '**#248 - Tyranitar** [Dark Rock]\nweakness: x1.96: [Fighting] x1.4: [Bug Grass Fairy Ground Steel Water]\nWonder CP: 2055 - 2097 \n```Att: Bite Stone Edge```'
    );
    msg.delete()
  } else if (msg.content === '!lugia') {
    msg.reply(
      '**#249 - Lugia** [Psychic Flying]\nweakness: x1.4: [Electric Rock Dark Ghost Ice]\nWonder CP: 2023 - 2053 \n```Att: Extrasensory    Sky Attack \nAtt: Extrasensory    Future Sight```'
    );
    msg.delete()
  } else if (msg.content === '!ho-oh' || msg.content === '!ho oh') {
    msg.reply(
      '**#250 - Ho-Oh** [Fire Flying]\nweakness: x1.96: [Rock] x1.4: [Electric Water]\nWonder CP: 2613 - 2657 \n```Att: ???```'
    );
    msg.delete()
  } else if (msg.content === '!missingno') {
    msg.reply(
      '**# けつばん - Missingno** [Normal 999]\nweakness: x1.4: [Fighting]\nWonder CP: 0x5E - 0xB5  \n```Att: Water Gun Sky Attack```\n'
    );
    msg.delete()
  } else

  //justforlol
  if (msg.content === '!mystic') {
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
  } else if (msg.content === '!valor') {
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
  } else if (msg.content === '!instinct') {
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

  } else if (msg.content === '!delft') {
    msg.reply(
      'Delft is het gebied waar wij proberen orde op zaken te stellen. Met de invasie van Candela en Spark hebben we flink werk aan de winkel. De gyms die we blauw willen houden, en de verschillende gebieden vanuit waar we dat organiseren zijn te vinden in: <https://www.google.com/maps/d/u/0/edit?mid=11DnpOBi-AsstZGT07NGO9txzxsU&ll=52.00888637739794%2C4.361529349999955&z=13>'
    );
  } else if (msg.content === '!spoofer') {
    msg.reply(
      'Een spoofer is iemand die het een goed idee vind om dit spel vanaf de bank te spelen. Dit soort treurige personen die hun pokemon niet waard zijn manipuleren hun GPS om het spel te spelen. Report dit soort faalhazen hier:\n\n<https://support.pokemongo.nianticlabs.com/hc/en-us/requests/new?ticket_form_id=319948>\nMoge Niantics banhamer genadeloos zijn'
    );
    msg.delete()
  } else if (msg.content === '!gyms') {
    msg.reply(
      'Hier is een kaart van alle gyms en regios in Delft, maak ze allemaal van ons! <https://www.google.com/maps/d/u/0/edit?mid=11DnpOBi-AsstZGT07NGO9txzxsU&ll=52.00888580917186%2C4.361529349999955&z=13>'
    );
    msg.delete()
  } else if (msg.content === '!minortextfixes') {
    msg.reply(
      'Minor text fixes verwijst gekmakend naar het regelmatig incapabele niantic. Het is een referentie naar een van de eerste updates waar het spel bijzonder slecht functioneerde en iedereen aan het wachten was op optimalisaties. Na de lange tijd van wachten verscheen eindelijk de update, en de change log was: *minor text fixes*'
    );
    msg.delete()
  } else if (msg.content === '!niantic') {
    msg.reply(
      'Niantic is het bedrijf dat Ingress 2 ontwikkelde en het Pokémon Go noemde. Door de gigantische populariteit van Pokémon is dit spel echter veel groter geworden, waardoor ze flink aan het groeien zijn.'
    );
    msg.delete()
  } else if (msg.content === '!pokemon' || msg.content ===
    '!pokémon') {
    msg.reply(
      'Pokémon zijn de loslopende beestjes die je kunt vangen om ze voor de glorie van team Mystic tegen Valor en Instinct te laten strijden.'
    );
    msg.delete()
  } else if (msg.content === '!weerbericht') {
    msg.reply(
      'Weer of geen weer, Valor en Instinct moeten uit hun gyms geschopt! Dus pak je revives, en ga ervoor! Articuno is niet voor niets de stormvogel!'
    );
    msg.delete()
  } else if (msg.content === '!stats') {
    msg.reply(
      'Zoek je meer data van een pokemon dan ik je kan geven? Kijk hier eens rond! <https://pokemongo.gamepress.gg/pokemon-list>'
    );
    msg.delete()
  } else if (msg.content === '!weerbericht') {
    msg.reply(
      'Weer of geen weer, Valor en Instinct moeten uit hun gyms geschopt! Dus pak je revives, en ga ervoor! Articuno is niet voor niets de stormvogel!'
    );
    msg.delete()
  } else if (msg.content === '!tutorial') {
    msg.reply(
      'Pokémon go lijkt simpel, maar stiekem is het een best complex spel. Niet gevreesd, er is een hele tutorial voor geschreven! <https://delftmystic.wordpress.com/>'
    );
    msg.delete()
  } else if (msg.content === '!iv' || msg.content === '!ivs' ||
    msg.content ===
    '!IVs') {
    msg.reply(
      'Zoek je nauwkeurigere IV informatie dan ik je kan geven? Gebruik deze apps:\nVoor apple: <https://itunes.apple.com/us/app/poke-genie-for-pokemon-go-auto-iv-calculator/id1143920524?mt=8>\nVoor android: <https://play.google.com/store/apps/details?id=tesmath.calcy&hl=en>\nVoor android optie 2: <https://github.com/farkam135/GoIV/releases>'
    );
    msg.delete()
  } else if (msg.content === '!nest') {
    msg.reply(
      'Naast de spawns die biome afhankelijk zijn heb je ook plekken die steeds dezelfde pokemon spawnen. Als je zon nest gevonden hebt of zoekt kun je dat hier aangeven: <https://thesilphroad.com/atlas#13.18/52.0073/4.3599>'
    );
    msg.delete()
  } else if (msg.content === '!ash') {
    msg.reply(
      'Een trainer uit Palet Town waardoor alle Pokémon hype is begonnen. Als hij trouw was gebleven aan zijn goede pokemon had hij het waarschijnlijk ver geschopt, maar hij vond het blijkbaar leuker om steeds opnieuw te beginnen.'
    );
    msg.delete()
  } else {
    const gymMatch = gyms.find((gym) => {
      if (!gym.keys) {
        console.log('gym has no key', gym);
        return;
      }

      return gym.keys.find((key) => {
        return msg.content.startsWith(key);
      });
    });

    if (gymMatch) {
      msg.reply(`**Gym: ${gymMatch.reply}`);
    }

    //pokestop spins
    const stopMatch = stops.find((stop) => {
      return msg.content.startsWith(stop.key);
    });

    if (stopMatch) {
      msg.reply(stopMatch.reply);
    }

    //give trusted role, admin only
    if (msg.content.startsWith('!add')) {
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
    if (msg.content.startsWith('!+centrum')) {
      let role = msg.guild.roles.find("name", "Centrum");
      msg.member.addRole(role).catch(console.error);
      msg.reply('Je hebt nu toegang tot het centrum gym kanaal!');
      msg.delete()
    } else if (msg.content.startsWith('!+hoven')) {
      let role = msg.guild.roles.find("name", "Hoven");
      msg.member.addRole(role).catch(console.error);
      msg.reply('Je hebt nu toegang tot het hoven gym kanaal!');
      msg.delete()
    } else if (msg.content.startsWith('!+tu')) {
      let role = msg.guild.roles.find("name", "TU");
      msg.member.addRole(role).catch(console.error);
      msg.reply('Je hebt nu toegang tot het tu-wijk gym kanaal!');
      msg.delete()
    } else if (msg.content.startsWith('!+tanthof')) {
      let role = msg.guild.roles.find("name", "Tanthof");
      msg.member.addRole(role).catch(console.error);
      msg.reply('Je hebt nu toegang tot het tanthof gym kanaal!');
      msg.delete()
    } else if (msg.content.startsWith('!+noord')) {
      let role = msg.guild.roles.find("name", "DelftNoord");
      msg.member.addRole(role).catch(console.error);
      msg.reply('Je hebt nu toegang tot het Noord-Delft gym kanaal!');
      msg.delete()
    } else if (msg.content.startsWith('!+oost')) {
      let role = msg.guild.roles.find("name", "DelftOost");
      msg.member.addRole(role).catch(console.error);
      msg.reply('Je hebt nu toegang tot het Oost-Delft gym kanaal!');
      msg.delete()
    } else if (msg.content.startsWith('!+english')) {
      let role = msg.guild.roles.find("name", "English");
      msg.member.addRole(role).catch(console.error);
      msg.reply('You now have access to the English channel!');
      msg.delete()
    } else

    //remove gym roles
    if (msg.content.startsWith('!-centrum')) {
      let role = msg.guild.roles.find("name", "Centrum");
      msg.member.removeRole(role).catch(console.error);
      msg.reply(
        'Je hebt nu geen toegang meer tot het centrum gym kanaal!');
      msg.delete()
    } else if (msg.content.startsWith('!-hoven')) {
      let role = msg.guild.roles.find("name", "Hoven");
      msg.member.removeRole(role).catch(console.error);
      msg.reply(
        'Je hebt nu geen toegang meer tot het hoven gym kanaal!');
      msg.delete()
    } else if (msg.content.startsWith('!-tu')) {
      let role = msg.guild.roles.find("name", "TU");
      msg.member.removeRole(role).catch(console.error);
      msg.reply(
        'Je hebt nu geen toegang meer tot het tu-wijk gym kanaal!');
      msg.delete()
    } else if (msg.content.startsWith('!-tanthof')) {
      let role = msg.guild.roles.find("name", "Tanthof");
      msg.member.removeRole(role).catch(console.error);
      msg.reply(
        'Je hebt nu geen toegang meer tot het tanthof gym kanaal!');
      msg.delete()
    } else if (msg.content.startsWith('!-noord')) {
      let role = msg.guild.roles.find("name", "DelftNoord");
      msg.member.removeRole(role).catch(console.error);
      msg.reply(
        'Je hebt nu geen toegang meer tot het Noord-Delft gym kanaal!');
      msg.delete()
    } else if (msg.content.startsWith('!-oost')) {
      let role = msg.guild.roles.find("name", "DelftOost");
      msg.member.removeRole(role).catch(console.error);
      msg.reply(
        'Je hebt nu geen toegang meer tot het Oost-Delft gym kanaal!');
      msg.delete()
    } else if (msg.content.startsWith('!-english')) {
      let role = msg.guild.roles.find("name", "English");
      msg.member.removeRole(role).catch(console.error);
      msg.reply('You now have lost access to the English channel!');
      msg.delete()
    } else

    //delete msgs

    if (msg.content.startsWith('!delete')) {
      if (msg.member.roles.has(moderator)) {
        var del = msg.content.split(" ");
        del.splice(0, 1);
        msg.channel.bulkDelete(del);
      } else {
        msg.reply('Alleen moderators kunnen berichten verwijderen')
      }
      msg.delete()
    } else {
      if (msg.content === "!test") {
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

var Discord = require('discord.js');
var client = new Discord.Client();
var settings = require("./settings.json")
client.login(settings.token);

client.on('ready', () => {
  console.log('Blanche: I am ready!');
});

client.on("message", (message) => {
  let prefix = settings.prefix;
  let moderator = settings.moderator;
  if (!message.content.startsWith(prefix) || message.author.bot) return;

//help
  if (message.content === '!help') {
   message.reply("Hey! Mijn naam is Blanche, en ik ben de teamleider van het beste team, Mystic! Naast het appraisen van jouw pokemon in game, kan ik jullie ook op discord assistentie verlenen. Ik kan bijvoorbeeld laten zien welke cp's en aanvallen je zoekt in raid bosses, typ bijvoorbeeld eens !tyranitar. Na jaren van studie heb ik ook alle type voordelen uit mijn hoofd geleerd, welke op te vragen zijn via !type. Verder help ik in deze discord met het verdelen van rollen (aan te vragen in het speler registratie kanaal) en kan ik ook informatie geven over de verschillende teams. Succes met het spel en maak me trots!");
   message.delete()
  } else

// Request pokemon info
  if (message.content === '!type') {
    message.reply("Zie hier een tabel met type effectiviteit:", {
    file: "https://image.ibb.co/mxRthv/Untitled.png"});
    message.delete()
  } else

  if (message.content === '!charizard') {
    message.reply('**#3 - Charizard** [Fire Flying]\nweakness: x1.96 [Rock] x1.4: [Electric Water]\nWonder CP: 1498 - 1535 \n```Att: Fire Spin Overheat```');
    message.delete()
  } else
  if (message.content === '!venusaur') {
    message.reply('**#6 - Venusaur** [Grass Poison]\nweakness: x1.4: [Fire Flying Ice Psychic]\nWonder CP: 1434 - 1467 \n```Att: Vine Whip Solar Beam```');
    message.delete()
  } else
  if (message.content === '!blastoise') {
    message.reply('**#9 - Blastoise** [Water]\nweakness: x1.4: [electric Grass]\nWonder CP: 1280 - 1309 \n```Att: Water Gun Hydro Pump```');
    message.delete()
  } else
  if (message.content === '!alakazam') {
    message.reply('**#65 - Alakazam** [Psychic]\nweakness: x1.4: [dark bug]\nWonder CP: 1608 - 1649 \n```Att: Psycho Cut  Future Sight```');
    message.delete()
  } else
  if (message.content === '!machamp') {
    message.reply('**#68 - Machamp** [Fighting]\nweakness: x1.4: [Fairy Flying Psychic]\nWonder CP: 1612 - 1649 \n```Att: Counter   Dynamic Punch```');
    message.delete()
  } else
  if (message.content === '!muk') {
    message.reply('**#89 - Muk** [Poison]\nweakness: x1.4: [Ground Psychic]\nWonder CP: 1517 - 1548 \n```Att&Def: Poison Jab Gunk Shot```');
    message.delete()
  } else
  if (message.content === '!gengar') {
    message.reply('**#94 - Gengar** [Ghost Poison]\nweakness: x1.4: [Dark Ground Ghost Psychic]\nWonder CP: 1454 - 1496 \n```Att: Hex  Shadow Ball```');
    message.delete()
  } else
  if (message.content === '!magikarp') {
    message.reply('**#103 - Magikarp** [Water]\nweakness: alles\nWonder CP: 119 - 125 \n```Att: Splash  Struggle```');
    message.delete()
  } else
  if (message.content === '!weezing') {
    message.reply('**#136 - Weezing** [Poison]\nweakness: x1.4: [Ground Psychic]\nWonder CP: 1218 - 1247 \n```Att&Def: Infestation Sludge Bomb```');
    message.delete()
  } else
  if (message.content === '!rhydon') {
    message.reply('**#112 - Rhydon** [Ground Rock]\nweakness: x1.96 [Grass Water] x1.4: [Ground Steel Fighting Ice]\nWonder CP: 1849 - 1886 \n```Att: Mud Slap Earthquake/Stone Edge```');
    message.delete()
  } else
  if (message.content === '!electabuzz') {
    message.reply('**#125 - Electabuzz** [Electric]\nweakness: x1.4: [Ground]\nWonder CP: 1222 - 1255 \n```Att: Thunder Shock Thunderbolt\n```');
    message.delete()
  } else
  if (message.content === '!magmar') {
    message.reply('**#136 - Magmar** [Fire]\nweakness: x1.4: [Rock Ground Water]\nWonder CP: 1254 - 1288 \n```Att: Ember Flamethrower```');
    message.delete()
  } else
  if (message.content === '!exeggutor') {
    message.reply('**#129 - Exeggutor** [Grass Psychic]\nweakness: x1.96 [Bug] x1.4: [Fire Dark Flying oison Ghost Ice]\nWonder CP: 1628 - 1666 \n```Att: Bullet Seed   Solar Beam\nDef: Extrasensory Solar Beam```');
    message.delete()
  } else
  if (message.content === '!lapras') {
    message.reply('**#131 - Lapras** [Ice Water]\nweakness: x1.4: [electric Grass Rock Fighting]\nWonder CP: 1459 - 1487 \n```Att: Frost Breath  Blizzard\n\nDef: Frost Breath  Ice Beam```');
    message.delete()
  } else
  if (message.content === '!vaporeon') {
    message.reply('**#134 - Vaporeon** [Water]\nweakness: x1.4: [electric Grass]\nWonder CP: 1769 - 1804 \n```Att: Water Gun  Hydro Pump```');
    message.delete()
  } else
  if (message.content === '!jolteon') {
    message.reply('**#135 - Jolteon** [Ground]\nweakness: x1.4: []\nWonder CP: 1520 - 1560 \n```Att: Thunder Shock Thunderbolt\n\nDef: Volt Switch Discharge```');
    message.delete()
  } else
  if (message.content === '!flareon') {
    message.reply('**#136 - Flareon** [Fire]\nweakness: x1.4: [Rock Ground Water]\nWonder CP: 1619 - 1659 \n```Att: Fire Spin Overheat\n\nDef: Fire Spin Flamethrower```');
    message.delete()
  } else
  if (message.content === '!snorlax') {
    message.reply('**#143 - Snorlax** [Normal]\nweakness: x1.4: [Fighting]\nWonder CP: 1885 - 1917 \n```Def: Zen Headbutt  Heavy Slam```');
    message.delete()
  } else
  if (message.content === '!articuno') {
    message.reply('**#144 - Articuno** [Ice Flying]\nweakness: x1.96: [Rock] x1.4: [Electric Fire Steel]\nWonder CP: 1644 - 1676 \n```Att: Frost Breath    Blizzard```');
    message.delete()
  } else
  if (message.content === '!zapdos') {
    message.reply('**#145 - Zapdos** [Electric Flying]\nweakness: x1.4: [Rock Ice]\nWonder CP: 1861 - 1902 \n```Att: Charge Beam    Zap Cannon```');
    message.delete()
  } else
  if (message.content === '!moltres') {
    message.reply('**#146 - Moltres** [Fire Flying]\nweakness: x1.96: [Rock] x1.4: [Water]\nWonder CP: 1828 - 1870 \n```Att: Fire Spin    Overheat```');
    message.delete()
  } else

  if (message.content === '!quilava') {
    message.reply('**#156 - Quilava** [Fire]\nweakness: x1.4: [Rock Ground Water]\nWonder CP: 821 - 847');
    message.delete()
  } else
  if (message.content === '!croconaw') {
    message.reply('**#159 - Croconaw** [Water]\nweakness: x1.4: [electric Grass]\nWonder CP: 888 - 913');
    message.delete()
  } else
  if (message.content === '!bayleef') {
    message.reply('**#153 - Bayleef** [Grass]\nweakness: x1.4: [Bug Fire Flying Poison Ice]\nWonder CP: 719 - 740');
    message.delete()
  } else
  if (message.content === '!shuckle') {
    message.reply('**#213 - Shuckle** [Bug Rock]\nweakness: x1.4: [Rock Steel Water]\nWonder CP: 165 - 171 \n```Att: Rock Throw Stone Edge```\nIk geef verder nog hetvolgende advies:\nDONT FUCKLE WITH SHUCKLE');
    message.delete()
  } else
  if (message.content === '!tyranitar' || message.content === '!ttar') {
    message.reply('**#248 - Tyranitar** [Dark Rock]\nweakness: x1.96: [Fighting] x1.4: [Bug Grass Fairy Ground Steel Water]\nWonder CP: 2055 - 2097 \n```Att: Bite Stone Edge```');
    message.delete()
  } else
  if (message.content === '!lugia') {
    message.reply('**#249 - Lugia** [Psychic Flying]\nweakness: x1.4: [Electric Rock Dark Ghost Ice]\nWonder CP: 2023 - 2053 \n```Att: Extrasensory    Sky Attack \nAtt: Extrasensory    Future Sight```');
   message.delete()
  } else
  if (message.content === '!ho-oh' || message.content === '!ho oh') {
    message.reply('**#250 - Ho-Oh** [Fire Flying]\nweakness: x1.96: [Rock] x1.4: [Electric Water]\nWonder CP: 2613 - 2657 \n```Att: ???```');
    message.delete()
  } else
  if (message.content === '!missingno') {
    message.reply('**# けつばん - Missingno** [Normal 999]\nweakness: x1.4: [Fighting]\nWonder CP: 0x5E - 0xB5  \n```Att: Water Gun Sky Attack```\n');
    message.delete()
  } else

//justforlol
  if (message.content === '!mystic') {
    message.channel.send('**Team Mystic**\nI am Blanche, leader of Team Mystic. The wisdom of Pokémon is immeasurably deep. I am researching why it is that they evolve.\nMy team? With our calm analysis of overy situation, we cant lose!', {
      file: "https://pogosa.net/images/mystic_leader.png" });
    setTimeout(() => {
    message.channel.send('Wat een prachtige woorden vind je niet? Met onze wijsheid kunnen we samen met onze Pokémon elke uitdaging aan!');;},1000);
    message.delete()
  } else
  if (message.content === '!valor') {
    message.channel.send('**Team Valor**\nI am Candela, Tem Valor Leader!. Pokemon are stronger than humans, and they are warmhearted, too! I am researching ways to enhance Pokémon natural power in the pursuit of true strength. There is no doubt that the Pokémon in our team have trained are the strongest in battle! Are you ready?', {
      file: "https://pogosa.net/images/valor_leader.png" });
    setTimeout(() => {
    message.channel.send('Pokemon sterker dan mensen? Bij jullie team twijfel ik daar soms over.... Dat onderzoek van jullie om pokemon sterker te maken is in elk geval hard nodig bij team faler!');;},1000);
    message.delete()
  } else
  if (message.content === '!instinct') {
    message.channel.send('**Team Instinct**\nHey! The names Spark- the leader of Team Instinct. Pokémon are creatures with excellent intuition. I bet the secret to their intuition is related to how theyre hatched. Come on and join my team! You never lose when you trust your instincts!', {
      file: "https://pogosa.net/images/instinct_leader.png" });
    setTimeout(() => {
    message.channel.send('Vertrouwen op je intuitie? We leven toch zeker niet meer in de steentijd? En wat heeft hebben die eieren daar nu weer mee te maken? Met dit soort uitspraken lijkt het soms alsof je zelf uit een ei bent gekomen...');;},1000);
    message.delete()
  } else
  if (message.content === '!delft') {
    message.reply('Delft is het gebied waar wij proberen orde op zaken te stellen. Met de invasie van Candela en Spark hebben we flink werk aan de winkel. De gyms die we blauw willen houden, en de verschillende gebieden vanuit waar we dat organiseren zijn te vinden in: <https://www.google.com/maps/d/u/0/edit?mid=11DnpOBi-AsstZGT07NGO9txzxsU&ll=52.00888637739794%2C4.361529349999955&z=13>');
    message.delete()
  } else
  if (message.content === '!spoofer') {
    message.reply('Een spoofer is iemand die het een goed idee vind om dit spel vanaf de bank te spelen. Dit soort treurige personen die hun pokemon niet waard zijn manipuleren hun GPS om het spel te spelen. Moge Niantics banhamer genadeloos zijn');
    message.delete()
  } else
  if (message.content === '!delft') {
    message.reply('Delft is het gebied waar wij proberen orde op zaken te stellen. Met de invasie van Candela en Spark hebben we flink werk aan de winkel. De gyms die we blauw willen houden, en de verschillende gebieden vanuit waar we dat organiseren zijn te vinden in: <https://www.google.com/maps/d/u/0/edit?mid=11DnpOBi-AsstZGT07NGO9txzxsU&ll=52.00888637739794%2C4.361529349999955&z=13>');
    message.delete()
  } else
  if (message.content === '!minortextfixes') {
    message.reply('Minor text fixes verwijst gekmakend naar het regelmatig incapabele niantic. Het is een referentie naar een van de eerste updates waar het spel bijzonder slecht functioneerde en iedereen aan het wachten was op optimalisaties. Na de lange tijd van wachten verscheen eindelijk de update, en de change log was: *minor text fixes*');
    message.delete()
  } else
  if (message.content === '!niantic') {
    message.reply('Niantic is het bedrijf dat Ingress 2 ontwikkelde en het Pokémon Go noemde. Door de gigantische populariteit van Pokémon is dit spel echter veel groter geworden, waardoor ze flink aan het groeien zijn.');
    message.delete()
  } else
  if (message.content === '!pokemon' || message.content === '!pokémon') {
    message.reply('Pokémon zijn de loslopende beestjes die je kunt vangen om ze voor de glorie van team Mystic tegen Valor en Instinct te laten strijden.');
    message.delete()
  } else
  if (message.content === '!weerbericht') {
    message.reply('Weer of geen weer, Valor en Instinct moeten uit hun gyms geschopt! Dus pak je revives, en ga ervoor! Articuno is niet voor niets de stormvogel!');
    message.delete()
  } else
  if (message.content === '!ash') {
    message.reply('Een trainer uit Palet Town waardoor alle Pokémon hype is begonnen. Als hij trouw was gebleven aan zijn goede pokemon had hij het waarschijnlijk ver geschopt, maar hij vond het blijkbaar leuker om steeds opnieuw te beginnen.');
    message.delete()
  } else



//gyms
if (message.content.startsWith("!3 variaties op een vierkant 2")) {message.reply("**Gym: 3 Variaties op een vierkant 2**\n<https://goo.gl/maps/WBmE2s8ypYU2>")} else
if (message.content.startsWith("!3 variaties op een vierkant 3")) {message.reply("**Gym: 3 Variaties op een vierkant 3**\n<https://goo.gl/maps/yYa2qy8XJ9p>")} else
if (message.content.startsWith("!artful")) {message.reply("**Gym: Artful Cube**\n<https://goo.gl/maps/DsUvD9NEPLx>")} else
if (message.content.startsWith("!bicycle")) {message.reply("**Gym: Bicycle Love**\n<https://goo.gl/maps/e5CBn5ixBDy>")} else
if (message.content.startsWith("!blue")) {message.reply("**Gym: Blue Birds Honkbal**\n<https://goo.gl/maps/WFiksvKEiR32>")} else
if (message.content.startsWith("!blauw-geel")) {message.reply("**Gym: Blauw-Geel Keramiek Object**\n<https://goo.gl/maps/RFLjygKU6LC2>")} else
if (message.content.startsWith("!blauw geel")) {message.reply("**Gym: Blauw-Geel Keramiek Object**\n<https://goo.gl/maps/RFLjygKU6LC2>")} else
if (message.content.startsWith("!cannon")) {message.reply("**Gym: Cannon**\n<https://goo.gl/maps/on2P21Zky4L2>")} else
if (message.content.startsWith("!climb")) {message.reply("**Gym: Climb the Frogs**\n<https://goo.gl/maps/XWeyq5BrBV22>")} else
if (message.content.startsWith("!color")) {message.reply("**Gym: Color Sculpture**\n<https://goo.gl/maps/kR2QeheLsZz>")} else
if (message.content.startsWith("!coligny")) {message.reply("**Gym: De Coligny**\n<https://goo.gl/maps/fNgWYGgmQQD2>")} else
if (message.content.startsWith("!delftse")) {message.reply("**Gym: De Delftse Pauw**\n<https://goo.gl/maps/CVrYXSJfwf32>")} else
if (message.content.startsWith("!hofstee")) {message.reply("**Gym: De Hofstee**\n<https://goo.gl/maps/kkwdPP9jce82>")} else
if (message.content.startsWith("!kamer")) {message.reply("**Gym: De Kamer van Charilabla 1614**\n<https://goo.gl/maps/jC6osbaZcaG2>")} else
if (message.content.startsWith("!nieuwe")) {message.reply("**Gym: De Nieuwe Lente**\n<https://goo.gl/maps/D1ZGGvH1ED72>")} else
if (message.content.startsWith("!oostpoort")) {message.reply("**Gym: De Oostpoort**\n<https://goo.gl/maps/APDKGayWZZN2>")} else
if (message.content.startsWith("!r.k.")) {message.reply("**Gym: De R.K. Kerk Antonius en Cornelius**\n<https://goo.gl/maps/3rbWddkmpaA2>")} else
if (message.content.startsWith("!rk")) {message.reply("**Gym: De R.K. Kerk Antonius en Cornelius**\n<https://goo.gl/maps/3rbWddkmpaA2>")} else
if (message.content.startsWith("!stier")) {message.reply("**Gym: De Stier**\n<https://goo.gl/maps/Xq77BkHMGbz>")} else
if (message.content.startsWith("!delft central")) {message.reply("**Gym: Delft Central Station**\n<https://goo.gl/maps/a5ypCkobkQ22>")} else
if (message.content.startsWith("!delfts blauwe")) {message.reply("**Gym: Delfts Blauwe Stenen**\n<https://goo.gl/maps/kJSKksZZPwq>")} else
if (message.content.startsWith("!delftse tegelmannen")) {message.reply("**Gym: Delftse Tegelmannen**\n<https://goo.gl/maps/eVA5ufuajzo>")} else
if (message.content.startsWith("!delftshout")) {message.reply("**Gym: Delftshout Levenslust**\n<https://goo.gl/maps/uwD9bsXTb5U2>")} else
if (message.content.startsWith("!delta rescue")) {message.reply("**Gym: Delta Rescue**\n<https://goo.gl/maps/s3nxAxVVu9G2>")} else
if (message.content.startsWith("!dok")) {message.reply("**Gym: Dok Delft Bibliotheek**\n<https://goo.gl/maps/KPuHh3CV2Yk>")} else
if (message.content.startsWith("!door")) {message.reply("**Gym: Door Art**\n<https://goo.gl/maps/74i4MtAuVzy>")} else
if (message.content.startsWith("!dsm")) {message.reply("**Gym: DSM Kunstwerk**\n<https://goo.gl/maps/ZUQ1PpQ5BiL2>")} else
if (message.content.startsWith("!dvv")) {message.reply("**Gym: Dvv Delft Tennis**\n<https://goo.gl/maps/btjqpgqHFY72>")} else
if (message.content.startsWith("!egg")) {message.reply("**Gym: Egg Mosaic**\n<https://goo.gl/maps/SjdaZoAmshn>")} else
if (message.content.startsWith("!engelse")) {message.reply("**Gym: Engelse Drop**\n<https://goo.gl/maps/ho5zAycvXqr>")} else
if (message.content.startsWith("!entrance")) {message.reply("**Gym: Entrance Bieslandse Bos Delft**\n<https://goo.gl/maps/187vzFFiCoE2>")} else
if (message.content.startsWith("!evenwicht")) {message.reply("**Gym: Evenwicht Ijzer**\n<https://goo.gl/maps/DYDKU8bcxCU2>")} else
if (message.content.startsWith("!giant grill")) {message.reply("**Gym: Giant Grill**\n<https://goo.gl/maps/q2gpVLkihu12>")} else
if (message.content.startsWith("!giant tripod")) {message.reply("**Gym: Giant Tripod at Rijkswaterstaat**\n<https://goo.gl/maps/qopEWA7HRMS2>")} else
if (message.content.startsWith("!glasbak")) {message.reply("**Gym: Glasbak Art**\n<https://goo.gl/maps/JUddhCkME9s>")} else
if (message.content.startsWith("!green")) {message.reply("**Gym: Green Chair with White Table**\n<https://goo.gl/maps/htvsSYTW5Qu>")} else
if (message.content.startsWith("!guardian")) {message.reply("**Gym: Guardian Angels**\n<https://goo.gl/maps/JmRrwx7rCQS2>")} else
if (message.content.startsWith("!hamenpoort")) {message.reply("**Gym: Hamenpoort Speelnatuur**\n<https://goo.gl/maps/JTAYj8BcdrR2>")} else
if (message.content.startsWith("!hbsv")) {message.reply("**Gym: HBSV Willem Tell**\n<https://goo.gl/maps/KgiMKZ57CeL2>")} else
if (message.content.startsWith("!hello")) {message.reply("**Gym: Hello Rainbow**\n<https://goo.gl/maps/muPhuRcYTpH2>")} else
if (message.content.startsWith("!blauwe hart")) {message.reply("**Gym: Het Blauwe Hart**\n<https://goo.gl/maps/oTH8eqavW132>")} else
if (message.content.startsWith("!veldje")) {message.reply("**Gym: Het Veldje**\n<https://goo.gl/maps/9cwyqtsBCos>")} else
if (message.content.startsWith("!high")) {message.reply("**Gym: High Water Bridge**\n<https://goo.gl/maps/e4BLwM2FAUm>")} else
if (message.content.startsWith("!highway")) {message.reply("**Gym: Highway Fitness Point**\n<https://goo.gl/maps/oW66Z3MJL3x>")} else
if (message.content.startsWith("!historic")) {message.reply("**Gym: Historic TU Delft Faculty Building**\n<https://goo.gl/maps/cVsDHyduBAT2>")} else
if (message.content.startsWith("!hoven")) {message.reply("**Gym: Hoven Passage**\n<https://goo.gl/maps/QBLQDrRAM1H2>")} else
if (message.content.startsWith("!ichtus")) {message.reply("**Gym: Ichtus**\n<https://goo.gl/maps/gMy63or6ZL62>")} else
if (message.content.startsWith("!kerkpolder")) {message.reply("**Gym: Kerkpolder**\n<https://goo.gl/maps/JKWRc8eAKyA2>")} else
if (message.content.startsWith("!klein")) {message.reply("**Gym: Klein Vrijenban**\n<https://goo.gl/maps/jvKQy7MFp9E2>")} else
if (message.content.startsWith("!klm")) {message.reply("**Gym: KLM Photon Torpedo**\n<https://goo.gl/maps/s2e3P8NbRNo>")} else
if (message.content.startsWith("!knooppunt")) {message.reply("**Gym: Knooppunt 59**\n<https://goo.gl/maps/BhUCRAaHHSH2>")} else
if (message.content.startsWith("!kolom")) {message.reply("**Gym: Kolom Van De Mensenrechten**\n<https://goo.gl/maps/dWKCFHijMbu>")} else
if (message.content.startsWith("!koninkrijkszaal")) {message.reply("**Gym: Koninkrijkszaal Van Jehovah's Getuigen**\n<https://goo.gl/maps/pbTxo6DKFXy>")} else
if (message.content.startsWith("!kwakkie")) {message.reply("**Gym: Kwakkie Verf**\n<https://goo.gl/maps/ruBbC96Mk1L2>")} else
if (message.content.startsWith("!library")) {message.reply("**Gym: Library TU Delft**\n<https://goo.gl/maps/VB27CE8egKG2>")} else
if (message.content.startsWith("!maria")) {message.reply("**Gym: Maria van Jesse kerk**\n<https://goo.gl/maps/4csETP8VSq62>")} else
if (message.content.startsWith("!mijlpaal")) {message.reply("**Gym: Mijlpaal**\n<https://goo.gl/maps/Zfj68NhETTS2>")} else
if (message.content.startsWith("!molen de")) {message.reply("**Gym: Molen De Klokkenmaker**\n<https://goo.gl/maps/Dj8Vx6FxbM62>")} else
if (message.content.startsWith("!molen steen")) {message.reply("**Gym: Molen Steen**\n<https://goo.gl/maps/cumNzZkTDkN2>")} else
if (message.content.startsWith("!monument")) {message.reply("**Gym: Monument JC Van Marken**\n<https://goo.gl/maps/hE8sKBJCpFy>")} else
if (message.content.startsWith("!moose")) {message.reply("**Gym: Moose Toy**\n<https://goo.gl/maps/9zBgbusGJbw>")} else
if (message.content.startsWith("!mural")) {message.reply("**Gym: Mural Pootstraat Carthuyzerstraat**\n<https://goo.gl/maps/cAy8ifVBgit>")} else
if (message.content.startsWith("!nep")) {message.reply("**Gym: Nep Ruïne**\n<https://goo.gl/maps/FqJQKw1jnBw>")} else
if (message.content.startsWith("!nieuwe")) {message.reply("**Gym: Nieuwe Kerk**\n<https://goo.gl/maps/muAF9RW6e3U2>")} else
if (message.content.startsWith("!old")) {message.reply("**Gym: Old Town Wall**\n<https://goo.gl/maps/z3XgKDttVxN2>")} else
if (message.content.startsWith("!overkapping")) {message.reply("**Gym: Overkapping Nr 5**\n<https://goo.gl/maps/uo2UzHiYS132>")} else
if (message.content.startsWith("!paddestoelen")) {message.reply("**Gym: Paddestoelen**\n<https://goo.gl/maps/U6PmwMxX5382>")} else
if (message.content.startsWith("!paint")) {message.reply("**Gym: Paint Jobs**\n<https://goo.gl/maps/3LW1TyqmFUT2>")} else
if (message.content.startsWith("!papegaaien")) {message.reply("**Gym: Papegaaien**\n<https://goo.gl/maps/8wwDTDqxxet>")} else
if (message.content.startsWith("!plaquette")) {message.reply("**Gym: Plaquette op bank**\n<https://goo.gl/maps/DjkYPsFRez82>")} else
if (message.content.startsWith("!playground brahmslaan")) {message.reply("**Gym: Playground Brahmslaan**\n<https://goo.gl/maps/EQTAJqWWshL2>")} else
if (message.content.startsWith("!playground straat")) {message.reply("**Gym: Playground Straat van Ormoes**\n<https://goo.gl/maps/LUroxsba6eP2>")} else
if (message.content.startsWith("!playground vivaldilaan")) {message.reply("**Gym: Playground Vivaldilaan**\n<https://goo.gl/maps/Sx4CwasGcju>")} else
if (message.content.startsWith("!prinses")) {message.reply("**Gym: Prinses Irene Tunnel**\n<https://goo.gl/maps/y9tMD3yrRc72>")} else
if (message.content.startsWith("!public")) {message.reply("**Gym: Public Library**\n<https://goo.gl/maps/26GDpDcz1gt>")} else
if (message.content.startsWith("!race")) {message.reply("**Gym: Race Planet Delft**\n<https://goo.gl/maps/TGuxkCTzPBT2>")} else
if (message.content.startsWith("!relief")) {message.reply("**Gym: Reliëf Driemaster Den Hoorn**\n<https://goo.gl/maps/4ThC211kxEm>")} else
if (message.content.startsWith("!royal")) {message.reply("**Gym: Royal Blue Bench**\n<https://goo.gl/maps/quM5tfFo8gH2>")} else
if (message.content.startsWith("!seats")) {message.reply("**Gym: Seats**\n<https://goo.gl/maps/Zo3UYRuvgVF2>")} else
if (message.content.startsWith("!solar")) {message.reply("**Gym: Solar Panel Art Sculpture**\n<https://goo.gl/maps/1HcF9hMXNrL2>")} else
if (message.content.startsWith("!space engineering")) {message.reply("**Gym: Space Engineering Faculty**\n<https://goo.gl/maps/kb4EmbwywYS2>")} else
if (message.content.startsWith("!space rocket")) {message.reply("**Gym: Space Rocket**\n<https://goo.gl/maps/T2so1vhEBGF2>")} else
if (message.content.startsWith("!speelplastiek")) {message.reply("**Gym: Speelplastiek Paarden**\n<https://goo.gl/maps/7TW2opLBW3p>")} else
if (message.content.startsWith("!speeltuintje")) {message.reply("**Gym: Speeltuintje Van Nora en Zoë**\n<https://goo.gl/maps/63f6kBZzr282>")} else
if (message.content.startsWith("!stadhuis")) {message.reply("**Gym: Stadhuis Delft**\n<https://goo.gl/maps/VDDXxhaAm922>")} else
if (message.content.startsWith("!stadsherberg")) {message.reply("**Gym: Stadsherberg De Mol**\n<https://goo.gl/maps/DfJUyD2AebE2>")} else
if (message.content.startsWith("!stalpaert")) {message.reply("**Gym: Stalpaert van der Wiele Statue**\n<https://goo.gl/maps/SWTWpzzBA6p>")} else
if (message.content.startsWith("!station")) {message.reply("**Gym: Station Delft-Zuid**\n<https://goo.gl/maps/UUuZexYicuS2>")} else
if (message.content.startsWith("!statue ")) {message.reply("**Gym: Statue Of Prometheus**\n<https://goo.gl/maps/C4Jtr7HKyVB2>")} else
if (message.content.startsWith("!stop")) {message.reply("**Gym: Stop Child Labor Wall Painting**\n<https://goo.gl/maps/uwVfaadDRyQ2>")} else
if (message.content.startsWith("!street")) {message.reply("**Gym: Street Art**\n<https://goo.gl/maps/5ETxB6masnr>")} else
if (message.content.startsWith("!sudden")) {message.reply("**Gym: Sudden Cow**\n<https://goo.gl/maps/tjd9BC6qXyG2>")} else
if (message.content.startsWith("!technische")) {message.reply("**Gym: Technische Universiteit Delft - EWI**\n<https://goo.gl/maps/nMzwudtx8sS2>")} else
if (message.content.startsWith("!whale")) {message.reply("**Gym: The Whale**\n<https://goo.gl/maps/JzYRD9ZdQmn>")} else
if (message.content.startsWith("!tiny")) {message.reply("**Gym: Tiny Castle**\n<https://goo.gl/maps/KFBsFjDAjVp>")} else
if (message.content.startsWith("!tno")) {message.reply("**Gym: TNO**\n<https://goo.gl/maps/fE81ibPTcpR2>")} else
if (message.content.startsWith("!tu delft - christiaan")) {message.reply("**Gym: TU Delft - Christiaan Huygens Statue**\n<https://goo.gl/maps/5XgjKNUJMEm>")} else
if (message.content.startsWith("!tu delft christiaan")) {message.reply("**Gym: TU Delft - Christiaan Huygens Statue**\n<https://goo.gl/maps/5XgjKNUJMEm>")} else
if (message.content.startsWith("!tu delft pyramide")) {message.reply("**Gym: TU Delft Pyramide**\n<https://goo.gl/maps/HuvMJPUacU92>")} else
if (message.content.startsWith("!2 haasje")) {message.reply("**Gym: Twee haasje over spelende kinderen**\n<https://goo.gl/maps/JM76fQWjjC92>")} else
if (message.content.startsWith("!twee")) {message.reply("**Gym: Twee haasje over spelende kinderen**\n<https://goo.gl/maps/JM76fQWjjC92>")} else
if (message.content.startsWith("!uitkijkpunt")) {message.reply("**Gym: Uitkijkpunt**\n<https://goo.gl/maps/Zj7vPbr4sER2>")} else
if (message.content.startsWith("!uitlaatstrook")) {message.reply("**Gym: Uitlaatstrook**\n<https://goo.gl/maps/EGnxgXEJaTq>")} else
if (message.content.startsWith("!vanons")) {message.reply("**Gym: VanOns**\n<https://goo.gl/maps/HFxZfao4QRN2>")} else
if (message.content.startsWith("!veld")) {message.reply("**Gym: Veld 23**\n<https://goo.gl/maps/AqfHtcSczH82>")} else
if (message.content.startsWith("!verkeer")) {message.reply("**Gym: Verkeer**\n<https://goo.gl/maps/Rps8xih9y3v>")} else
if (message.content.startsWith("!veulentje")) {message.reply("**Gym: Veulentje**\n<https://goo.gl/maps/LYnU2UDUDpF2>")} else
if (message.content.startsWith("!voormalige")) {message.reply("**Gym: Voormalige Universiteitsbibliotheek**\n<https://goo.gl/maps/JVtRcbL2ecx>")} else
if (message.content.startsWith("!vrouw")) {message.reply("**Gym: Vrouw Met Bloemen**\n<https://goo.gl/maps/KCUd4GiCAWK2>")} else
if (message.content.startsWith("!wapenschild")) {message.reply("**Gym: Wapenschild Holland**\n<https://goo.gl/maps/RpJDxyYk4QM2>")} else
if (message.content.startsWith("!watertoren")) {message.reply("**Gym: Watertoren**\n<https://goo.gl/maps/SjjGCspruhM2>")} else
if (message.content.startsWith("!wijkcentrum")) {message.reply("**Gym: Wijkcentrum De Parel**\n<https://goo.gl/maps/q9gSyAfqcPq>")} else
if (message.content.startsWith("!wild")) {message.reply("**Gym: Wild Bee House**\n<https://goo.gl/maps/Emy3RmYRtYx>")} else
if (message.content.startsWith("!willem")) {message.reply("**Gym: Willem van Oranje (Willem de Zwijger)**\n<https://goo.gl/maps/B98NGDnXYcP2>")} else
if (message.content.startsWith("!wood")) {message.reply("**Gym: Wood Frog**\n<https://goo.gl/maps/cxT5hEw8vHK2>")} else
if (message.content.startsWith("!world")) {message.reply("**Gym: World Art Delft**\n<https://goo.gl/maps/dVww6WFVY9u>")} else
if (message.content.startsWith("!zeehond")) {message.reply("**Gym: Zeehond**\n<https://goo.gl/maps/Qm9bmcStv322>")} else
if (message.content.startsWith("!zoas")) {message.reply("**Gym: Zoäs Birdhouse**\n<https://goo.gl/maps/gejprGbGVcL2>")} else
if (message.content.startsWith("!zonnewijzer")) {message.reply("**Gym: Zonnewijzer**\n<https://goo.gl/maps/U19CmCWSus82>")} else
if (message.content.startsWith("!zwarte")) {message.reply("**Gym: Zwarte Zwaan**\n<https://goo.gl/maps/jvts7BQZzC42>")} else


//give trusted role, admin only
 if (message.content.startsWith('!add')) {
 if(message.member.roles.has(moderator)) {
 let member = message.mentions.members.first();
 let role = message.guild.roles.find("name", "makingdelftblueagain");
 member.addRole(role).catch(console.error);
 message.channel.send('Welkom ' + member + ', je bent nu officieel toegevoegd! In het kanaal #welkom is te lezen hoe deze discord werkt, lees dat dus vooral eens door! ;)');
 } else { message.reply('Leden verifieren kan alleen door een moderator worden gedaan') }
 message.delete() }  else

//request gym roles
 if (message.content.startsWith('!+centrum')) {
 let role = message.guild.roles.find("name", "Centrum");
 message.member.addRole(role).catch(console.error);
 message.reply('Je hebt nu toegang tot het centrum gym kanaal!');
 message.delete()
 } else
 if (message.content.startsWith('!+hoven')) {
 let role = message.guild.roles.find("name", "Hoven");
 message.member.addRole(role).catch(console.error);
 message.reply('Je hebt nu toegang tot het hoven gym kanaal!');
 message.delete()
 } else
 if (message.content.startsWith('!+tu')) {
 let role = message.guild.roles.find("name", "TU");
 message.member.addRole(role).catch(console.error);
 message.reply('Je hebt nu toegang tot het tu-wijk gym kanaal!');
 message.delete()
 } else
 if (message.content.startsWith('!+tanthof')) {
 let role = message.guild.roles.find("name", "Tanthof");
 message.member.addRole(role).catch(console.error);
 message.reply('Je hebt nu toegang tot het tanthof gym kanaal!');
 message.delete()
 } else
 if (message.content.startsWith('!+noord')) {
 let role = message.guild.roles.find("name", "DelftNoord");
 message.member.addRole(role).catch(console.error);
 message.reply('Je hebt nu toegang tot het Noord-Delft gym kanaal!');
 message.delete()
 } else
 if (message.content.startsWith('!+oost')) {
 let role = message.guild.roles.find("name", "DelftOost");
 message.member.addRole(role).catch(console.error);
 message.reply('Je hebt nu toegang tot het Oost-Delft gym kanaal!');
 message.delete()
 } else
 if (message.content.startsWith('!+english')) {
 let role = message.guild.roles.find("name", "English");
 message.member.addRole(role).catch(console.error);
 message.reply('You now have access to the English channel!');
 message.delete()
 } else

//remove gym roles
 if (message.content.startsWith('!-centrum')) {
 let role = message.guild.roles.find("name", "Centrum");
 message.member.removeRole(role).catch(console.error);
 message.reply('Je hebt nu geen toegang meer tot het centrum gym kanaal!');
 message.delete()
 } else
 if (message.content.startsWith('!-hoven')) {
 let role = message.guild.roles.find("name", "Hoven");
 message.member.removeRole(role).catch(console.error);
 message.reply('Je hebt nu geen toegang meer tot het hoven gym kanaal!');
 message.delete()
 } else
 if (message.content.startsWith('!-tu')) {
 let role = message.guild.roles.find("name", "TU");
 message.member.removeRole(role).catch(console.error);
 message.reply('Je hebt nu geen toegang meer tot het tu-wijk gym kanaal!');
 message.delete()
 } else
 if (message.content.startsWith('!-tanthof')) {
 let role = message.guild.roles.find("name", "Tanthof");
 message.member.removeRole(role).catch(console.error);
 message.reply('Je hebt nu geen toegang meer tot het tanthof gym kanaal!');
 message.delete()
 } else
 if (message.content.startsWith('!-noord')) {
 let role = message.guild.roles.find("name", "DelftNoord");
 message.member.removeRole(role).catch(console.error);
 message.reply('Je hebt nu geen toegang meer tot het Noord-Delft gym kanaal!');
 message.delete()
 } else
 if (message.content.startsWith('!-oost')) {
 let role = message.guild.roles.find("name", "DelftOost");
 message.member.removeRole(role).catch(console.error);
 message.reply('Je hebt nu geen toegang meer tot het Oost-Delft gym kanaal!');
 message.delete()
 } else
 if (message.content.startsWith('!-english')) {
 let role = message.guild.roles.find("name", "English");
 message.member.removeRole(role).catch(console.error);
 message.reply('You now have lost access to the English channel!');
 message.delete()
 } else

//delete messages

if (message.content.startsWith('!delete')) {
if(message.member.roles.has(moderator)) {
  var del = message.content.split(" ");
  del.splice(0, 1);
  message.channel.bulkDelete(del);
} else { message.reply('Alleen moderators kunnen berichten verwijderen') }
message.delete() }
});

//welcome new users

client.on('guildMemberAdd', member => {
setTimeout(() => {
member.guild.defaultChannel.send(`Welkom op de Mystic Delft Discord en leuk dat je onze groep wilt versterken, ${member}!\nOm toegang te krijgen tot de volledige groep vragen wij een screenshot van je pokemon go profiel (dat is waar je naast je buddy staat). Als je deze kan uploaden zal een van de moderators je zo snel mogelijk te woord staan.\n\nWelcome to our Mystic Delft Discord group, ${member}!\nIn order to get full access to our server, we would like to verify you are indeed mystic. If  you would be so kind as to upload a screenshot of your Pokémon Go profile (where you are standing next to your buddy) one of our moderators will contact you as soon as possible.`);},1000);
});

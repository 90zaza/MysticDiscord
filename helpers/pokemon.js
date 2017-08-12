const cpMultiplier = [0.094,      0.16639787, 0.21573247, 0.25572005, 0.29024988,
                      0.3210876 , 0.34921268, 0.37523559, 0.39956728, 0.42250001,
                      0.44310755, 0.46279839, 0.48168495, 0.49985844, 0.51739395,
                      0.53435433, 0.55079269, 0.56675452, 0.58227891, 0.59740001,
                      0.61215729, 0.62656713, 0.64065295, 0.65443563, 0.667934,
                      0.68116492, 0.69414365, 0.70688421, 0.71939909, 0.7317,
                      0.73776948, 0.74378943, 0.74976104, 0.75568551, 0.76156384,
                      0.76739717, 0.7731865,  0.77893275, 0.78463697, 0.79030001];

exports.cpRangeWonder = function(pokemon, level) {

  let m = cpMultiplier[level - 1];

  // For max CP all IVs are 15
  let atkval = (pokemon.stats[0] + 15) * m;
  let defval = Math.sqrt((pokemon.stats[1] + 15) * m);
  let staval = Math.sqrt((pokemon.stats[2] + 15) * m);
  let maxCP = Math.floor( atkval * defval * staval * 0.1);

  // a wonder has at least a combined 82.5% IV (37 out of 45)
  // since the the stats vary its not fixed which combination is the lowest, so we test all that result in 82.5%IV
  let minCP = 9999;
  for(var a = 7; a < 16; a++){
    for(var s = 7; s < 16; s++){
      for(var d = 7; d < 16; d++){
        if(a + s + d == 37)
        {
          atkval = (pokemon.stats[0] + a) * m;
          defval = Math.sqrt((pokemon.stats[1] + d) * m);
          staval = Math.sqrt((pokemon.stats[2] + s) * m);
          let cp = Math.floor( atkval * defval * staval * 0.1);

          if( cp < minCP ){ minCP = cp; }
        }
      }
    }
  }

  return [minCP, maxCP];
}

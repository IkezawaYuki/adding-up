'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ 'input': rs, 'output':{}})
const prefectureMap = new Map();
rl.on('line', (lineString) => {
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const prefecture = columns[1];
  const pop = columns[3];
  if (year === 2010 || year == 2015){
    let value = prefectureMap.get(prefecture);
    if (!value){
      value = {
        pop10: 0,
        pop15: 0,
        change: null,
      };
    }
    if (year === 2010){
      value.pop10 = pop;
    }
    if (year === 2015){
      value.pop15 = pop;
    }
    prefectureMap.set(prefecture, value);
  }
});

rl.on('close', () => {
  for (let [key, value] of prefectureMap){
    value.change = value.pop15 / value.pop10;
  }
  const rankingArray = Array.from(prefectureMap).sort((pair1, pair2) => {
    return pair2[1].change - pair1[1].change;
  })
  const rankingString = rankingArray.map(([key, value]) => {
    return key + ': ' + value.pop10 +  '=>' + value.pop15 + ' 変化率：' + value.change;
  })
  console.log(rankingString);
})
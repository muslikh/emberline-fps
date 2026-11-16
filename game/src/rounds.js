export function createRounds(){
  const s={phase:'menu',round:1,score:[0,0],money:3200,time:12,objective:'SECURE THE RELAY'};
  return {
    state:s,
    start(){s.phase='live';s.time=95;},
    tick(dt){if(s.phase==='buy'||s.phase==='live')s.time=Math.max(0,s.time-dt);},
    buy(cost){if(s.money>=cost){s.money-=cost;return true;}return false;},
    win(team){s.score[team]++;s.phase=s.score[team]>=5?'match':'win';s.time=s.phase==='match'?0:5;s.money+=team===0?3250:1800;},
    next(){s.round++;s.phase='buy';s.time=12;s.money+=800;},
  };
}
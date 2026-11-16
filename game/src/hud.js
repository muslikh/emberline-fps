export function createHud(){
  const $=id=>document.getElementById(id), overlay=$('overlay');
  return {
    set(data){
      $('hp').textContent=Math.max(0,Math.ceil(data.hp));$('armor').textContent=Math.max(0,Math.ceil(data.armor));
      $('mag').textContent=data.mag;$('reserve').textContent=data.reserve;$('money').textContent='$'+data.money.toLocaleString();
      $('timer').textContent=Math.ceil(data.time).toString().padStart(2,'0');$('round').textContent=`ROUND ${data.round} / 10`;
      $('score').textContent=`${data.score[0]} — ${data.score[1]}`;$('feed').innerHTML=data.feed||'';
    },
    overlay(mode,title,copy){$('overlay-title').textContent=title;$('overlay-copy').textContent=copy;$('play').textContent=mode==='buy'?'START ROUND':mode==='start'?'DEPLOY':'CONTINUE';overlay.hidden=false;},
    hide(){overlay.hidden=true;},
    onPlay(fn){$('play').onclick=fn;},
    hit(){const x=$('hit');x.classList.add('on');setTimeout(()=>x.classList.remove('on'),120);},
  };
}
import * as THREE from 'three';
import {PALETTE} from './palette.js';
import {createWorld} from './world.js';
import {createPlayer} from './player.js';
import {createWeapon} from './weapon.js';
import {createInput} from './input.js';
import {createHud} from './hud.js';
import {createBots} from './bots.js';
import {createNav} from './nav.js';
import {createRounds} from './rounds.js';
import {createAudio} from './audio.js';

const params=new URLSearchParams(location.search),shot=params.get('shot'),seed=Number(params.get('seed')||1);
let rng=seed>>>0;const random=()=>{rng=(rng*1664525+1013904223)>>>0;return rng/4294967296;};
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;document.getElementById('game').appendChild(renderer.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color(PALETTE.void);scene.fog=new THREE.Fog(PALETTE.void,18,40);
const camera=new THREE.PerspectiveCamera(72,innerWidth/innerHeight,.05,100);scene.add(camera);
const world=createWorld(scene),nav=createNav(),player=createPlayer(world.colliders),weapon=createWeapon(camera),input=createInput(renderer.domElement),hud=createHud(),rounds=createRounds(),audio=createAudio(),bots=createBots(scene,nav,world.shootables,random),ray=new THREE.Raycaster();
let feed='',running=false,manualFrame=false,last=performance.now();
function aim(){camera.position.set(player.state.position.x,player.state.position.y+player.state.eye,player.state.position.z);camera.rotation.set(player.state.pitch,player.state.yaw,0,'YXZ');}
function shoot(){if(!weapon.ready())return;weapon.fire();audio.shot();camera.getWorldDirection(ray.ray.direction);ray.set(camera.position,ray.ray.direction);const hit=ray.intersectObjects(bots.list.filter(b=>b.alive).flatMap(b=>[b.body,b.head]),false)[0];if(hit){const b=hit.object.userData.bot;b.hp-=hit.object===b.head?100:34;hud.hit();if(b.hp<=0){b.alive=false;b.group.visible=false;feed=`<b>EMBER</b> eliminated <span>RIVAL ${bots.list.indexOf(b)+1}</span>`;audio.round();if(bots.list.every(x=>!x.alive))endRound(0);}}player.recoil();}
function endRound(team){rounds.win(team);running=false;input.state.firing=false;hud.overlay(rounds.state.phase,'ROUND WIN',team===0?'Relay secured. Your squad owns the lane.':'The opposing squad controls the relay.');}
function buyShop(){if(rounds.state.phase==='buy'&&rounds.buy(2700)){weapon.state.capacity=30;weapon.state.mag=30;weapon.state.reserve=90;feed='<b>SHOP</b> VANTA rifle equipped';}}
function start(){audio.boot();running=true;manualFrame=false;rounds.start();bots.reset();weapon.reset();player.state.hp=100;player.state.position.set(0,0,8);hud.hide();input.lock();}
hud.onPlay(()=>{if(rounds.state.phase==='win'){rounds.next();hud.overlay('buy','BUY PHASE','Spend credits before the next push. Press 1 for rifle or 2 for armor.');return;}if(rounds.state.phase==='buy')start();else start();});
function setupShot(name){if(name==='start'){rounds.state.phase='menu';rounds.state.time=12;hud.overlay('start','EMBERLINE','A round based tactical FPS. Attack the relay, win the economy, own the lanes.');}else if(name==='buy'){rounds.state.phase='buy';rounds.state.time=12;hud.overlay('buy','BUY PHASE // RELAY DISTRICT','Spend credits, then push through the relay lanes.  [1] VANTA RIFLE $2700   [2] ARMOUR $650   [G] GRENADE $300');buyShop();}else{rounds.start();running=true;player.state.position.set(0,0,7);player.state.yaw=0;bots.list.forEach((b,i)=>{b.hp=100;b.alive=true;b.group.visible=true;b.group.position.set([-8,-3,3,8][i],0,[-7,-5,-5,-7][i]);});if(name==='play'){feed='<b>EMBER</b> ready  •  <span>4 RIVALS</span>  •  OBJECTIVE: SECURE RELAY';hud.hide();}if(name==='roundwin'){bots.list.slice(1).forEach(b=>{b.alive=false;b.group.visible=false;});feed='<b>EMBER</b> eliminated RIVAL 2  •  <b>ROUND WIN</b>';rounds.win(0);hud.overlay('win','ROUND WIN','Relay secured. Your squad owns the lane.');}}aim();hud.set({hp:player.state.hp,armor:player.state.armor,mag:weapon.state.mag,reserve:weapon.state.reserve,money:rounds.state.money,time:rounds.state.time,round:rounds.state.round,score:rounds.state.score,feed});renderOnce();}
function renderOnce(){aim();renderer.render(scene,camera);manualFrame=shot!=='play';window.__shotReady=true;}
function update(dt){if(!running)return;rounds.tick(dt);const look=input.look();player.look(look.x,look.y);const s=input.state;if(s.keys.has('KeyR'))weapon.reload();if(s.keys.has('Digit1'))buyShop();if(s.keys.has('Digit2')&&rounds.state.phase==='buy'&&rounds.buy(650))player.state.armor=100;if(s.firing)shoot();player.step(dt,s.keys);weapon.step(dt);bots.step(dt,player.state,b=>{if(random()<.25){player.state.hp=Math.max(0,player.state.hp-7);feed='<span>CONTACT</span> incoming fire';}});if(rounds.state.time<=0&&rounds.state.phase==='live')endRound(0);if(player.state.hp<=0)endRound(1);aim();hud.set({hp:player.state.hp,armor:player.state.armor,mag:weapon.state.mag,reserve:weapon.state.reserve,money:rounds.state.money,time:rounds.state.time,round:rounds.state.round,score:rounds.state.score,feed});}
function frame(now){requestAnimationFrame(frame);if(!manualFrame){update(Math.min(.05,(now-last)/1000));last=now;renderer.render(scene,camera);}}
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
if(shot)setupShot(shot);else hud.overlay('start','EMBERLINE','A round based tactical FPS. Attack the relay, win the economy, own the lanes.');aim();frame(performance.now());
import * as THREE from 'three';
export function createWeapon(camera){
 const g=new THREE.Group(),dark=new THREE.MeshStandardMaterial({color:0x263538,metalness:.7,roughness:.3}),warm=new THREE.MeshStandardMaterial({color:0xe36b3d});
 function part(w,h,d,x,y,z,m=dark){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);g.add(o);}
 part(.16,.17,.55,0,0,0);part(.075,.075,.45,0,.025,-.45);part(.09,.23,.12,0,-.16,.06);part(.18,.06,.33,0,.11,-.07,warm);part(.05,.07,.05,0,.16,-.23);part(.12,.13,.22,0,0,.35);part(.14,.13,.24,-.04,-.1,-.24,warm);
 const flash=new THREE.Mesh(new THREE.ConeGeometry(.1,.3,6),new THREE.MeshBasicMaterial({color:0xffd77c}));flash.rotation.x=Math.PI/2;flash.position.z=-.8;g.add(flash);flash.visible=false;g.position.set(.3,-.26,-.5);camera.add(g);
 const s={mag:25,reserve:75,cool:0,reload:0,kick:0,spread:0,capacity:25};
 return {state:s,flash,step(dt){s.cool=Math.max(0,s.cool-dt);if(s.reload>0){s.reload=Math.max(0,s.reload-dt);if(!s.reload){const n=Math.min(s.capacity-s.mag,s.reserve);s.mag+=n;s.reserve-=n;}}s.kick=Math.max(0,s.kick-dt*.3);s.spread=Math.max(0,s.spread-dt*.025);g.position.z=-.5+s.kick;g.rotation.x=-s.kick;flash.visible=s.cool>.08;},ready(){return s.cool===0&&s.reload===0&&s.mag>0;},fire(){s.mag--;s.cool=.14;s.kick=.065;s.spread=Math.min(.035,s.spread+.006);flash.visible=true;},reload(){if(s.mag<s.capacity&&s.reserve&&s.reload===0){s.reload=1.7;return true;}return false;},reset(){s.mag=s.capacity;s.reserve=s.capacity*3;s.cool=s.reload=s.spread=0;}};
}

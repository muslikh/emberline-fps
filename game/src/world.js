import * as THREE from 'three';
import {PALETTE} from './palette.js';
export function createWorld(scene){
 const group=new THREE.Group();scene.add(group);const colliders=[],shootables=[];
 const M={floor:new THREE.MeshStandardMaterial({color:0x233b40,roughness:.85}),wall:new THREE.MeshStandardMaterial({color:0x28454b,roughness:.8}),teal:new THREE.MeshStandardMaterial({color:PALETTE.teal,roughness:.65}),orange:new THREE.MeshStandardMaterial({color:PALETTE.orange,roughness:.65}),gold:new THREE.MeshStandardMaterial({color:0xb39256,metalness:.5,roughness:.45}),dark:new THREE.MeshStandardMaterial({color:0x101f29,metalness:.5}),light:new THREE.MeshBasicMaterial({color:0x86eee3}),glow:new THREE.MeshBasicMaterial({color:0x88dedb})};
 function box(w,h,d,x,y,z,m,solid=true){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M[m]);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;group.add(o);if(solid)colliders.push(new THREE.Box3().setFromObject(o));shootables.push(o);return o;}
 box(24,.3,26,0,-.15,0,'floor',false);box(24,10,.4,0,5,-12,'wall');box(.4,6,26,-12,3,0,'wall');box(.4,6,26,12,3,0,'wall');
 // Overhead gantries give the upper frame depth and lit structure.
 for(const z of [-10,-5,1]){box(24,.3,.45,0,6.7,z,'dark',false);box(20,.045,.08,0,6.52,z+.25,'light',false);}
 for(const x of [-8,5])box(.28,.25,22,x,7,-1,'teal',false);
 box(24,.2,26,0,8.5,0,'wall',false);
 // Side cover leaves an uninterrupted central engagement lane.
 box(4,1.3,1.3,-5,.65,1,'teal');box(4,1.3,1.3,6,.65,0,'teal');box(1.4,.9,1.5,-3.8,.45,4,'gold');
 box(3,.8,2,-8,.4,-6,'teal');box(3,.8,2,8,.4,-6,'teal');
 for(const x of [-10,-6,6,10]){box(.45,6,.8,x,3,-11.6,'dark');box(.08,4,.06,x,3,-11.12,'light',false);}
 for(const x of [-11.6,11.6])for(const z of [-8,-2,5]){box(.7,5,.5,x,2.5,z,'dark');box(.08,3,.12,x+(x<0?.4:-.4),2.8,z,'light',false);}
 box(19,.45,.7,0,5.6,-8,'dark');box(16,.055,.1,0,5.32,-7.7,'light',false);
 for(const x of [-2.8,2.8]){box(.045,.015,20,x,.015,-1,'teal',false);for(let z=-10;z<10;z+=2)box(.3,.016,.07,x,.02,z,'light',false);}
 for(let z=-10;z<10;z+=2)box(24,.012,.025,0,.01,z,'dark',false);
 // Relay tower, elevated and warm against the cool industrial shell.
 box(3,.3,2.5,0,.15,-9,'dark');box(1.5,2.4,1.3,0,1.5,-9,'gold');box(.8,1.5,1.42,0,1.7,-9,'dark');
 for(const x of [-.57,.57])box(.1,1.8,1.45,x,1.7,-9,'glow',false);
 box(.65,.65,.65,0,3.1,-9,'glow',false);box(3.8,.10,.2,-3.5,6,-11.3,'light',false);
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=256;const ctx=canvas.getContext('2d');ctx.fillStyle='#10232c';ctx.fillRect(0,0,1024,256);ctx.fillStyle='#a6c9c7';ctx.font='bold 92px monospace';ctx.textAlign='center';ctx.fillText('RELAY / 07',512,110);ctx.fillStyle='#64c9cc';ctx.font='32px monospace';ctx.fillText('EMBERLINE  •  TRANSIT SECTOR',512,185);const sign=new THREE.Mesh(new THREE.PlaneGeometry(7,1.75),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(canvas)}));sign.position.set(-3.5,6.6,-11.75);group.add(sign);
 const hemi=new THREE.HemisphereLight(0x9cdce9,0x283439,1.4);hemi.layers.enable(1);scene.add(hemi);
 const sun=new THREE.DirectionalLight(0xffd6aa,3.4);sun.layers.enable(1);sun.position.set(-8,12,4);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-18,right:18,top:18,bottom:-18});sun.shadow.bias=-.001;scene.add(sun);
 const fill=new THREE.DirectionalLight(0x64d8e9,1.2);fill.position.set(8,5,-6);fill.layers.enable(1);scene.add(fill);
 const relayLight=new THREE.PointLight(0x72dedb,35,9,2);relayLight.position.set(0,3,-8);scene.add(relayLight);
 return{colliders,shootables,group};
}

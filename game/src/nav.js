import * as THREE from 'three';
const NODES=[[-8,8],[-3,6],[3,6],[8,8],[-8,1],[-2,1],[2,1],[8,1],[-8,-6],[-3,-4],[3,-4],[8,-6]];
const LINKS=[[0,1],[1,2],[2,3],[0,4],[1,5],[2,6],[3,7],[4,5],[5,6],[6,7],[4,8],[5,9],[6,10],[7,11],[8,9],[9,10],[10,11]];
export function createNav(){return {nodes:NODES.map(([x,z])=>new THREE.Vector3(x,0,z)),links:LINKS,nearest(pos){let best=0,d=Infinity;this.nodes.forEach((n,i)=>{const q=n.distanceToSquared(pos);if(q<d){d=q;best=i;}});return best;},route(a,b){const q=[a],prev={[a]:-1};while(q.length){const n=q.shift();if(n===b)break;for(const e of this.links){const v=e[0]===n?e[1]:e[1]===n?e[0]:-1;if(v>=0&&prev[v]===undefined){prev[v]=n;q.push(v);}}}const out=[];for(let n=b;n>=0;n=prev[n])out.unshift(n);return out;}};}

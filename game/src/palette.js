import * as THREE from 'three';

export const PALETTE={void:'#071016',floor:'#16252a',wall:'#24383b',teal:'#2b8a86',orange:'#e36b3d',gold:'#f3c969',paper:'#e8eee8',muted:'#91a8a5',red:'#d95656',blue:'#57b5c8'};
export const mat=(color,rough=.8,metal=0)=>new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal});

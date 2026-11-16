import * as THREE from 'three';

export const PALETTE={void:'#344950',floor:'#34474b',wall:'#647779',teal:'#359d98',orange:'#e36b3d',gold:'#f3c969',paper:'#e8eee8',muted:'#91a8a5',red:'#d95656',blue:'#57b5c8'};
export const mat=(color,rough=.8,metal=0)=>new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal});

import * as THREE from './node_modules/three/build/three.module.js';

export const UP = new THREE.Vector3(0, 1, 0);
export const RIGHT = new THREE.Vector3(1, 0, 0);
export const FORWARD = new THREE.Vector3(0, 0, 1);

export const LOGO_COUNT = 11;

export const playerAccel = 10.0; //the player acceleration per second
export const maxVel = 10.0; //the maximim player velocity per second

export const playerStartPos = new THREE.Vector3(0, 0, 0);
export const cameraStartPos = new THREE.Vector3(75, 75, 75);

//this is the min and max values for the playable area
// the player should not be able to move beyond these values
export const minX = -20.0;
export const maxX = 20.0;
export const minZ = -20.0;
export const maxZ = 20.0;

//this is the max distance the player may be from the objects to interact with it
export const interaction_distance = 70;

//the positions of the interactive elements in the scenea
export const about_tech_pos = new THREE.Vector3(10, 2, -10);
export const about_me_pos = new THREE.Vector3(-10, 2, -10);
export const about_projects_pos = new THREE.Vector3(-10, 2, 10);
export const about_this_pos = new THREE.Vector3(10, 2, 10);
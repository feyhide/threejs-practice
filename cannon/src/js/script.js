import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

import * as CANNON from 'cannon-es';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 20, -30);
orbit.update();

const boxGeo = new THREE.BoxGeometry(2, 2, 2);
const boxMat = new THREE.MeshBasicMaterial({
	color: 0x00ff00,
	wireframe: true
});
const boxMesh = new THREE.Mesh(boxGeo, boxMat);
scene.add(boxMesh);

const sphereGeo = new THREE.SphereGeometry(2);
const sphereMat = new THREE.MeshBasicMaterial({ 
	color: 0xff0000, 
	wireframe: true,
 });
const sphereMesh = new THREE.Mesh( sphereGeo, sphereMat);
scene.add(sphereMesh);

const groundGeo = new THREE.PlaneGeometry(30, 30);
const groundMat = new THREE.MeshBasicMaterial({ 
	color: 0xffffff,
	side: THREE.DoubleSide,
	wireframe: false 
 });
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);


const world = new CANNON.World({
    gravity: new CANNON.Vec3(0,-9.81,0)
});

const groundBodyMat = new CANNON.Material();
const groundBody = new CANNON.Body({
    // this is will make infinite shape: new CANNON.Plane(),
    shape: new CANNON.Box(new CANNON.Vec3(15,15,0.2)),
    //mass: 1,
    type: CANNON.Body.STATIC,
    material: groundBodyMat,
});
world.addBody(groundBody);

const boxBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(1,1,1))
});
boxBody.position.y=12;
world.addBody(boxBody);
boxBody.angularVelocity.set(0,0,1);
boxBody.linearDamping = 0.31;

const sphereBodyMat = new CANNON.Material();
const sphereBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Sphere(2),
    material: sphereBodyMat,
});
sphereBody.position.y=14;
sphereBody.position.x=1;
world.addBody(sphereBody);
sphereBody.linearDamping = 0.31; //airresistance
const timeStep = 1/60;
groundBody.quaternion.setFromEuler(-Math.PI/2,0,0);

const groundBodyContactMaterial = new CANNON.ContactMaterial(
    groundBodyMat,
    sphereBodyMat,
    {restitution: 1}
);
world.addContactMaterial(groundBodyContactMaterial);

function animate() {
    world.step(timeStep);

    groundMesh.position.copy(groundBody.position);
    groundMesh.quaternion.copy(groundBody.quaternion);
    
     boxMesh.position.copy(boxBody.position);
     boxMesh.quaternion.copy(boxBody.quaternion);
    
     sphereMesh.position.copy(sphereBody.position);
     sphereMesh.quaternion.copy(sphereBody.quaternion);
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
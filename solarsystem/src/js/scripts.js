import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import starsTexture from '../img/stars.jpg';
import sunTexture from '../img/sun.jpg';
import mercuryTexture from '../img/mercury.jpg';
import venusTexture from '../img/venus.jpg';
import earthTexture from '../img/earth.jpg';
import marsTexture from '../img/mars.jpg';
import jupiterTexture from '../img/jupiter.jpg';
import saturnTexture from '../img/saturn.jpg';
import saturnRingTexture from '../img/saturn ring.png';
import uranusTexture from '../img/uranus.jpg';
import uranusRingTexture from '../img/uranus ring.png';
import neptuneTexture from '../img/neptune.jpg';
import plutoTexture from '../img/pluto.jpg';

const renderer = new THREE.WebGLRenderer({antialias: true});

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

const gui = new dat.GUI();

camera.position.set(-90, 140, 140);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture
]);

const textureLoader = new THREE.TextureLoader();

//creating spheres for planets material and geomatery
//creating another parent in the place of sun to rotate at slower rate
const parentmercury = new THREE.Object3D();
scene.add(parentmercury);

const parentvenus = new THREE.Object3D();
scene.add(parentvenus);

const parentearth = new THREE.Object3D();
scene.add(parentearth);

const parentmars = new THREE.Object3D();
scene.add(parentmars);

const parentjupiter = new THREE.Object3D();
scene.add(parentjupiter);

const parentsaturn = new THREE.Object3D();
scene.add(parentsaturn);

const parenturanus = new THREE.Object3D();
scene.add(parenturanus);

const parentneptune = new THREE.Object3D();
scene.add(parentneptune);



const sunGeo = new THREE.SphereGeometry(16,30,30);
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture)
});
const sun = new THREE.Mesh(sunGeo,sunMat);
scene.add(sun);

/////////////////////////////////////////////////////

const mercuryGeo = new THREE.SphereGeometry(3.2,30,30);
const mercuryMat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(mercuryTexture)
});
const mercury = new THREE.Mesh(mercuryGeo,mercuryMat);
parentmercury.add(mercury);
mercury.position.x = 32;

/////////////////////////////////////////////////////

const marsGeo = new THREE.SphereGeometry(5,30,30);
const marsMat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(marsTexture)
});
const mars = new THREE.Mesh(marsGeo,marsMat);
parentmars.add(mars);
mars.position.x = 56;

/////////////////////////////////////////////////////

const earthGeo = new THREE.SphereGeometry(7,30,30);
const earthMat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(earthTexture)
});
const earth = new THREE.Mesh(earthGeo,earthMat);
parentearth.add(earth);
earth.position.x = 48;

/////////////////////////////////////////////////////

const venusGeo = new THREE.SphereGeometry(6,30,30);
const venusMat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(venusTexture)
});
const venus = new THREE.Mesh(venusGeo,venusMat);
parentvenus.add(venus);
venus.position.x = 40;

/////////////////////////////////////////////////////

const jupiterGeo = new THREE.SphereGeometry(6,30,30);
const jupiterMat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(jupiterTexture)
});
const jupiter = new THREE.Mesh(jupiterGeo,jupiterMat);
parentjupiter.add(jupiter);
jupiter.position.x = 64;

/////////////////////////////////////////////////////

const saturnGeo = new THREE.SphereGeometry(6,30,30);
const saturnMat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(saturnTexture)
});
const saturn = new THREE.Mesh(saturnGeo,saturnMat);
parentsaturn.add(saturn);
saturn.position.x = 72;

const saturnringGeo = new THREE.RingGeometry(10,20,30);
const saturnringMat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(saturnRingTexture),
    side: THREE.DoubleSide
});
const saturnring = new THREE.Mesh(saturnringGeo,saturnringMat);
saturn.add(saturnring);

/////////////////////////////////////////////////////

const uranusGeo = new THREE.SphereGeometry(6,30,30);
const uranusMat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(uranusTexture)
});
const uranus = new THREE.Mesh(uranusGeo,uranusMat);
parenturanus.add(uranus);
uranus.position.x = 80;

/////////////////////////////////////////////////////

const neptuneGeo = new THREE.SphereGeometry(6,30,30);
const neptuneMat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(neptuneTexture)
});
const neptune = new THREE.Mesh(neptuneGeo,neptuneMat);
parentneptune.add(neptune);
neptune.position.x = 88;



//light of sun
const pointLight = new THREE.PointLight(0xffffff,2,300);
scene.add(pointLight);

const parcel = require('parcel');

const assetLoader = new GLTFLoader().setPath("../asset/");

assetLoader.load('scene.gltf', function(gltf) {
    const model = gltf.scene;
    model.position.set(0,0,0);
    scene.add(model);
    console.log(model);

}, undefined, function(error) {
    console.error(error);
});










function animate() {
    sun.rotateY(0.004)
    mercury.rotateY(0.004)
    mars.rotateY(0.004)
    parentmercury.rotateY(0.01);
    parentvenus.rotateY(0.009);
    parentearth.rotateY(0.008);
    parentmars.rotateY(0.007);
    parentjupiter.rotateY(0.006);
    parentsaturn.rotateY(0.005);
    parenturanus.rotateY(0.004);
    parentneptune.rotateY(0.003);
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
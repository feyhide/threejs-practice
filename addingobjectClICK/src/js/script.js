import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// // Sets the color of the background
// renderer.setClearColor(0xFEFEFE);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Sets orbit control to move the camera around
const orbit = new OrbitControls(camera, renderer.domElement);

// Camera positioning
camera.position.set(0, 6, 6);
orbit.update();


const ambientlight = new THREE.AmbientLight(0x333333);
scene.add(ambientlight);

const directionallight = new THREE.DirectionalLight(0xffffff,0.8);
scene.add(directionallight);
directionallight.position.set(0,50,0);



// Sets a 12 by 12 gird helper
// const gridHelper = new THREE.GridHelper(12, 12);
// scene.add(gridHelper);



// Sets the x, y, and z axes with each having a length of 4
const axesHelper = new THREE.AxesHelper(4);
scene.add(axesHelper);


const mouse = new THREE.Vector2();
const intersection = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const raycaster = new THREE.Raycaster();

window.addEventListener('mousemove', function (e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
    
    // Define a plane perpendicular to the camera's direction
    plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(planeNormal), camera.position);
    
    // Update the raycaster with the new mouse position
    raycaster.setFromCamera(mouse, camera);
    
    // Calculate intersection point with the plane
    raycaster.ray.intersectPlane(plane, intersection);
});


window.addEventListener('click', function (event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        // Take the first intersection point
        const intersection = intersects[0].point;

        // Spawn sphere at intersection point
        const sphereGeo = new THREE.SphereGeometry(0.125, 30, 30);
        const sphereMat = new THREE.MeshStandardMaterial({
            color: 0xFFEA00,
            metalness: 0,
            roughness: 0
        });
        const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
        sphereMesh.position.copy(intersection);
        scene.add(sphereMesh);
    }
});





function animate() {
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
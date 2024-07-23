import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

import wow from '../img/wow.jpg';


const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth,window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);
const textureLoader = new THREE.TextureLoader();


const orbit = new OrbitControls(camera,renderer.domElement);
const axesHelper = new THREE.AxesHelper(5);

scene.add(axesHelper);

camera.position.set(-10,30,30);
orbit.update();

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshStandardMaterial({color: 0x00FF00});
const box = new THREE.Mesh(boxGeometry,boxMaterial);
//scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(30,30);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry,planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5*Math.PI;
plane.receiveShadow = true;

const gridHelper = new THREE.GridHelper(30,30);
scene.add(gridHelper);


const sphereGeometry = new THREE.SphereGeometry(4,50,50);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    wireframe: false,
    //map: textureLoader.load(wow)
});
const sphere = new THREE.Mesh(sphereGeometry,sphereMaterial);
scene.add(sphere);
sphere.position.set(0,6,0)
sphere.castShadow = true;


const ambientlight = new THREE.AmbientLight(0x333333);
scene.add(ambientlight);

const directionallight =  new THREE.DirectionalLight(0xFFFFFF,0.8);
scene.add(directionallight)
directionallight.position.set(30,50,0)
directionallight.castShadow = true;
directionallight.shadow.camera.top = 10;



const dlighthelper = new THREE.DirectionalLightHelper(directionallight);
scene.add(dlighthelper)

const dlightshadowhelper = new THREE.CameraHelper(directionallight.shadow.camera);
scene.add(dlightshadowhelper);
// const spotLight = new THREE.SpotLight(0xFFFFFF)
// spotLight.position.set(0, 50, 0);
// spotLight.shadow.mapSize.width = 1024;
// spotLight.shadow.mapSize.height = 1024;

// spotLight.shadow.camera.near = 500;
// spotLight.shadow.camera.far = 4000;
// spotLight.shadow.camera.fov = 30;
// // for shadow
// spotLight.castShadow = true
// scene.add( spotLight );
// const helper = new THREE.SpotLightHelper(spotLight)
// scene.add(helper)

//scene.fog = new THREE.Fog(0xffffff,0,200);
scene.fog = new THREE.FogExp2(0xffffff,0.01)


//renderer.setClearColor(0xffffff)
//scene.background = textureLoader.load(wow);

const cubeTextureLoader = new THREE.CubeTextureLoader();
const texture = cubeTextureLoader.load([
    wow, // Positive X
    wow, // Negative X
    wow, // Positive Y
    wow, // Negative Y
    wow, // Positive Z
    wow  // Negative Z
]);
scene.background = texture;

const box2geometry = new THREE.BoxGeometry(4,4,4);

const box2material = new THREE.MeshBasicMaterial({
    //color: 0xffffff,
    //map: textureLoader.load(wow),
});
const box2multimaterial = [
    new THREE.MeshBasicMaterial({map: textureLoader.load(wow)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(wow)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(wow)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(wow)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(wow)}),
    new THREE.MeshBasicMaterial({map: textureLoader.load(wow)}),
]
const box2 = new THREE.Mesh(box2geometry,box2multimaterial);
scene.add(box2);
box2.position.set(0,15,10);




const gui = new dat.GUI();

const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.01,
    // angle: 0.2,
    // penumbra: 0.2,
    // intensity: 0.1
};

gui.addColor(options,'sphereColor').onChange(function(e){
    sphere.material.color.set(e);
});

gui.add(options,'wireframe').onChange(function(e){
    sphere.material.wireframe = e;
});
gui.add(options,'speed',0,0.1);
// gui.add(options,'angle',0,0.1);
// gui.add(options,'penumbra',0,0.1);
// gui.add(options,'intensity',0,0.1);


let step = 0;

const mousePosition = new THREE.Vector2();

window.addEventListener('mousemove',function(e){
    mousePosition.x = (e.clientX/window.innerWidth)*2-1;
    mousePosition.y = (e.clientY/window.innerHeight)*2+1;
})

const rayCaster = new THREE.Raycaster();

const sphereid = sphere.id;
function animate(){
    box.rotation.x += 0.01;

    box.rotation.y += 0.01;

    step += options.speed;
    sphere.position.y = 10*Math.abs(Math.sin(step));
    // spotLight.angle = options.angle;
    // spotLight.penumbra = options.penumbra;
    // spotLight.intensity = options.intensity;
    // helper.update();

    rayCaster.setFromCamera(mousePosition,camera);
    const intersects = rayCaster.intersectObjects(scene.children);
    console.log(intersects);
    for (let i = 0; i < intersects.length; i++) {
        if(intersects[i].object.id == sphereid){
           sphere.material.color.set(0xffffff)
        }
        
    }
    renderer.render(scene,camera);
}

renderer.setAnimationLoop(animate);


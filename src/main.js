import * as THREE from 'three';
import './style.css';

const app = document.getElementById('app');

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b1020);

// Viewport sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// PerspectiveCamera
const camera = new THREE.PerspectiveCamera(
  60,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(4, 3, 6);
camera.lookAt(0, 0.5, 0);
scene.add(camera);

// WebGLRenderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
app.appendChild(renderer.domElement);

// Cube dengan MeshBasicMaterial
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// Transform Cube (position, rotation, scale)
cube.position.set(-1.2, 0.6, 0);
cube.rotation.y = Math.PI / 4;
cube.scale.set(1.2, 0.8, 1.2);

scene.add(cube);

// Sphere dengan MeshPhongMaterial (merespons lighting)
const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 16);
const sphereMaterial = new THREE.MeshPhongMaterial({
  color: 0x4488ff,
  shininess: 60,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(1.4, 0.75, 0);
scene.add(sphere);

renderer.render(scene, camera);

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
renderer.shadowMap.enabled = true;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
app.appendChild(renderer.domElement);

// Cube dengan MeshBasicMaterial
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x22d3ee });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// Transform Cube (position, rotation, scale)
cube.position.set(-1.2, 0.6, 0);
cube.rotation.y = Math.PI / 4;
cube.scale.set(1.2, 0.8, 1.2);

cube.castShadow = true;
scene.add(cube);

// Sphere dengan MeshPhongMaterial (merespons lighting)
const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 16);
const sphereMaterial = new THREE.MeshPhongMaterial({
  color: 0x4488ff,
  shininess: 60,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(1.4, 0.75, 0);
sphere.castShadow = true;
scene.add(sphere);

// Ground dengan PlaneGeometry horizontal
const groundGeometry = new THREE.PlaneGeometry(10, 10);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x334155 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.receiveShadow = true;
scene.add(ground);

// Lighting: AmbientLight & DirectionalLight
const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
directionalLight.position.set(3, 5, 2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.left = -5;
directionalLight.shadow.camera.right = 5;
directionalLight.shadow.camera.top = 5;
directionalLight.shadow.camera.bottom = -5;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 20;
scene.add(directionalLight);

// Animation loop dengan delta time
const clock = new THREE.Clock();
let elapsed = 0;

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.05);
  elapsed += delta;

  cube.rotation.y += 0.8 * delta;
  sphere.rotation.y += 0.5 * delta;
  sphere.position.y = 0.75 + Math.sin(elapsed * 2.0) * 0.15;

  renderer.render(scene, camera);
}

animate();

// Responsive Rendering
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Update HUD sederhana
const info = document.getElementById('info');
function updateHUD() {
  if (info) {
    info.textContent = `Objects: ${scene.children.length} | Camera: ${camera.position.x.toFixed(1)}, ${camera.position.y.toFixed(1)}, ${camera.position.z.toFixed(1)}`;
  }
}

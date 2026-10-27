import * as THREE from 'three';
import './style.css';

const app = document.getElementById('app');
const info = document.getElementById('info');

// ----------------------------------------------------------------------
// 1. Scene & Setup (Milestone 1 & 2)
// ----------------------------------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b1020);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// ----------------------------------------------------------------------
// 2. Camera (Milestone 2)
// ----------------------------------------------------------------------
const camera = new THREE.PerspectiveCamera(
  60,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(4, 3, 6);
camera.lookAt(0, 0.5, 0);
scene.add(camera);

// ----------------------------------------------------------------------
// 3. WebGLRenderer (Milestone 2 & 8: Shadow Enabled)
// ----------------------------------------------------------------------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true; // Milestone 8
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
app.appendChild(renderer.domElement);

// ----------------------------------------------------------------------
// 4. Geometri Objek — Shape 1: Cube (Milestone 3 & 4: Transform)
// ----------------------------------------------------------------------
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshLambertMaterial({
  color: 0x22d3ee, // Cyan
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

// Transformasi objek (Milestone 4)
cube.position.set(-1.2, 0.6, 0);
cube.rotation.y = Math.PI / 4;
cube.scale.set(1.2, 0.8, 1.2);

// Shadow caster (Milestone 8)
cube.castShadow = true;
scene.add(cube);

// ----------------------------------------------------------------------
// 5. Geometri Objek — Shape 2: Sphere (Milestone 5)
// ----------------------------------------------------------------------
const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 16);
const sphereMaterial = new THREE.MeshPhongMaterial({
  color: 0x4488ff, // Biru
  shininess: 60,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(1.4, 0.75, 0);

// Shadow caster (Milestone 8)
sphere.castShadow = true;
scene.add(sphere);

// ----------------------------------------------------------------------
// 6. Ground — PlaneGeometry (Milestone 6)
// ----------------------------------------------------------------------
const groundGeometry = new THREE.PlaneGeometry(10, 10);
groundGeometry.rotateX(-Math.PI / 2); // Rotasi horizontal
const groundMaterial = new THREE.MeshLambertMaterial({
  color: 0x334155, // Slate Grey
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);

// Shadow receiver (Milestone 8)
ground.receiveShadow = true;
scene.add(ground);

// ----------------------------------------------------------------------
// 7. Lighting (Milestone 7 & 8)
// ----------------------------------------------------------------------
// AmbientLight (Pencahayaan dasar seluruh scene)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
scene.add(ambientLight);

// DirectionalLight (Cahaya terarah penghasil bayangan)
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
directionalLight.position.set(3, 5, 2);
directionalLight.castShadow = true;

// Konfigurasi shadow camera & map size (Milestone 8)
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.left = -5;
directionalLight.shadow.camera.right = 5;
directionalLight.shadow.camera.top = 5;
directionalLight.shadow.camera.bottom = -5;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 20;
scene.add(directionalLight);

// ----------------------------------------------------------------------
// 8. Animation Loop dengan Delta Time (Milestone 9)
// ----------------------------------------------------------------------
const clock = new THREE.Clock();
let elapsed = 0;
let frameCount = 0;
let lastFpsTime = performance.now();
let fps = 60;

function updateHUD() {
  if (info) {
    info.textContent = `Objects: ${scene.children.length} | Camera: (${camera.position.x.toFixed(1)}, ${camera.position.y.toFixed(1)}, ${camera.position.z.toFixed(1)}) | ${fps} FPS`;
  }
}

function animate(currentTime) {
  requestAnimationFrame(animate);

  // Delta time untuk kecepatan independen frame-rate
  const delta = Math.min(clock.getDelta(), 0.05);
  elapsed += delta;

  // Hitung FPS sederhana
  frameCount++;
  if (currentTime - lastFpsTime >= 500) {
    fps = Math.round((frameCount * 1000) / (currentTime - lastFpsTime));
    frameCount = 0;
    lastFpsTime = currentTime;
  }

  // Rotasi kontinu objek
  cube.rotation.y += 0.8 * delta;
  sphere.rotation.y += 0.5 * delta;

  // Gerak melayang sinusoidal pada bola
  sphere.position.y = 0.75 + Math.sin(elapsed * 2.0) * 0.15;

  // Update HUD status
  updateHUD();

  // Render scene
  renderer.render(scene, camera);
}

// Jalankan animasi loop
animate(performance.now());

// ----------------------------------------------------------------------
// 9. Responsive Rendering (Milestone 10)
// ----------------------------------------------------------------------
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Perbarui rasio aspek kamera & matriks proyeksi
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Perbarui ukuran renderer & pixel ratio
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

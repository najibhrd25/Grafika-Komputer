import * as THREE from 'three';
import './style.css';

// ----------------------------------------------------------------------
// 1. Scene & Setup
// ----------------------------------------------------------------------
const app = document.getElementById('app');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x070b14);
scene.fog = new THREE.FogExp2(0x070b14, 0.035);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// ----------------------------------------------------------------------
// 2. Cameras (Challenge C: Perspective ↔ Orthographic)
// ----------------------------------------------------------------------
const perspectiveCamera = new THREE.PerspectiveCamera(
  60,
  sizes.width / sizes.height,
  0.1,
  100
);
perspectiveCamera.position.set(4.5, 3.5, 6.5);
perspectiveCamera.lookAt(0, 0.6, 0);
scene.add(perspectiveCamera);

const frustumSize = 6.5;
let aspect = sizes.width / sizes.height;
const orthographicCamera = new THREE.OrthographicCamera(
  (-frustumSize * aspect) / 2,
  (frustumSize * aspect) / 2,
  frustumSize / 2,
  -frustumSize / 2,
  0.1,
  100
);
orthographicCamera.position.set(4.5, 3.5, 6.5);
orthographicCamera.lookAt(0, 0.6, 0);
scene.add(orthographicCamera);

let activeCamera = perspectiveCamera;
let isOrthographic = false;

// ----------------------------------------------------------------------
// 3. WebGLRenderer
// ----------------------------------------------------------------------
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance',
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Shadow configuration
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Prepend canvas so HUD overlays on top
app.prepend(renderer.domElement);

// ----------------------------------------------------------------------
// 4. Lighting & Shadows
// ----------------------------------------------------------------------
// Ambient Light (Pencahayaan dasar seluruh scene)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.38);
scene.add(ambientLight);

// Directional Light (Cahaya terarah seperti matahari, penghasil shadow utama)
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.2);
directionalLight.position.set(3.5, 5.5, 2.5);
directionalLight.castShadow = true;

// Konfigurasi shadow camera & map size
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 25;
directionalLight.shadow.camera.left = -6;
directionalLight.shadow.camera.right = 6;
directionalLight.shadow.camera.top = 6;
directionalLight.shadow.camera.bottom = -6;
directionalLight.shadow.bias = -0.0005;
scene.add(directionalLight);

// Visual marker penanda posisi DirectionalLight (Challenge D)
const lightMarkerGeo = new THREE.SphereGeometry(0.12, 16, 8);
const lightMarkerMat = new THREE.MeshBasicMaterial({ color: 0xfff3a1 });
const lightMarker = new THREE.Mesh(lightMarkerGeo, lightMarkerMat);
lightMarker.position.copy(directionalLight.position);
scene.add(lightMarker);

// Subtle warm hemisphere light for secondary depth
const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 0.25);
scene.add(hemiLight);

// ----------------------------------------------------------------------
// 5. Geometries & Materials (Core + Challenge A + Challenge B Gallery)
// ----------------------------------------------------------------------

// 5.1 Ground (PlaneGeometry)
const groundGeometry = new THREE.PlaneGeometry(16, 16);
groundGeometry.rotateX(-Math.PI / 2); // Rotasi horizontal
const groundMaterial = new THREE.MeshLambertMaterial({
  color: 0x17223b,
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.receiveShadow = true; // Ground sebagai receiver
scene.add(ground);

// Grid Helper dekoratif untuk membantu perspektif ruang 3D
const gridHelper = new THREE.GridHelper(16, 16, 0x38bdf8, 0x1e293b);
gridHelper.position.y = 0.001; // Sedikit di atas ground agar tidak z-fighting
scene.add(gridHelper);

// 5.2 Cube (BoxGeometry - MeshLambertMaterial, Controllable)
const cubeGeometry = new THREE.BoxGeometry(1.1, 1.1, 1.1);
const cubeMaterial = new THREE.MeshLambertMaterial({
  color: 0x22d3ee, // Cyan
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
const initialCubePos = new THREE.Vector3(-1.4, 0.55, 0.2);
cube.position.copy(initialCubePos);
cube.castShadow = true;
cube.receiveShadow = true;
scene.add(cube);

// 5.3 Sphere (SphereGeometry - MeshPhongMaterial)
const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 24);
const sphereMaterial = new THREE.MeshPhongMaterial({
  color: 0x3b82f6, // Blue
  shininess: 70,
  specular: 0x93c5fd,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(1.4, 0.75, 0.2);
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add(sphere);

// 5.4 Torus (Challenge A + B: Normal Material)
const torusGeometry = new THREE.TorusGeometry(0.5, 0.18, 20, 48);
const torusMaterial = new THREE.MeshNormalMaterial();
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(0, 0.85, -1.8);
torus.castShadow = true;
torus.receiveShadow = true;
scene.add(torus);

// 5.5 Cone (Challenge A + B: Basic Material - Unlit)
const coneGeometry = new THREE.ConeGeometry(0.55, 1.2, 32);
const coneMaterial = new THREE.MeshBasicMaterial({
  color: 0xec4899, // Pink
});
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.position.set(-2.8, 0.6, -1.3);
cone.castShadow = true;
scene.add(cone);

// 5.6 Cylinder (Challenge A + B: Standard PBR Material)
const cylinderGeometry = new THREE.CylinderGeometry(0.45, 0.45, 1.2, 32);
const cylinderMaterial = new THREE.MeshStandardMaterial({
  color: 0x10b981, // Emerald Green
  roughness: 0.35,
  metalness: 0.65,
});
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinder.position.set(2.8, 0.6, -1.3);
cylinder.castShadow = true;
cylinder.receiveShadow = true;
scene.add(cylinder);

// ----------------------------------------------------------------------
// 6. State & Interactive Controls (Challenge G, H, C, D)
// ----------------------------------------------------------------------
const clock = new THREE.Clock();
let elapsed = 0;
let isAnimationRunning = true; // Challenge G: Toggle Animation
let isLightOrbiting = true;    // Challenge D: Light Animation

// Key states for continuous smooth control (Challenge H)
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  KeyQ: false,
  KeyE: false,
};

window.addEventListener('keydown', (e) => {
  if (e.code in keys) {
    keys[e.code] = true;
    e.preventDefault();
  }

  // Challenge G: Space to toggle animation
  if (e.code === 'Space') {
    e.preventDefault();
    toggleAnimation();
  }

  // Challenge C: 'P' to toggle Perspective / Orthographic
  if (e.code === 'KeyP') {
    e.preventDefault();
    toggleCamera();
  }

  // Challenge D: 'L' to toggle light orbit
  if (e.code === 'KeyL') {
    e.preventDefault();
    toggleLightOrbit();
  }

  // Camera presets
  if (e.code === 'Digit1') setCameraView(4.5, 3.5, 6.5, 0, 0.6, 0);
  if (e.code === 'Digit2') setCameraView(0.5, 1.8, 3.2, 0, 0.6, 0);
  if (e.code === 'Digit3') setCameraView(0.01, 8.5, 0.01, 0, 0, 0);
});

window.addEventListener('keyup', (e) => {
  if (e.code in keys) {
    keys[e.code] = false;
  }
});

function toggleAnimation() {
  isAnimationRunning = !isAnimationRunning;
  const statEl = document.getElementById('animStateStat');
  const btnEl = document.getElementById('btnToggleAnim');
  if (isAnimationRunning) {
    statEl.textContent = 'RUNNING';
    statEl.className = 'hud-val status-running';
    btnEl.textContent = '⏸ Pause Anim';
  } else {
    statEl.textContent = 'PAUSED';
    statEl.className = 'hud-val status-paused';
    btnEl.textContent = '▶ Resume Anim';
  }
}

function toggleCamera() {
  isOrthographic = !isOrthographic;
  activeCamera = isOrthographic ? orthographicCamera : perspectiveCamera;
  const statEl = document.getElementById('cameraModeStat');
  statEl.textContent = isOrthographic ? 'Orthographic' : 'Perspective (FOV: 60°)';
  statEl.className = isOrthographic ? 'hud-val highlight-cyan' : 'hud-val badge-accent';
}

function toggleLightOrbit() {
  isLightOrbiting = !isLightOrbiting;
  const statEl = document.getElementById('lightOrbitStat');
  const btnEl = document.getElementById('btnToggleLight');
  if (isLightOrbiting) {
    statEl.textContent = 'ACTIVE';
    statEl.className = 'hud-val status-running';
    btnEl.textContent = '💡 Toggle Light (L)';
  } else {
    statEl.textContent = 'FROZEN';
    statEl.className = 'hud-val status-paused';
    btnEl.textContent = '💡 Resume Light';
  }
}

function resetCube() {
  cube.position.copy(initialCubePos);
  cube.rotation.set(0, 0, 0);
}

function setCameraView(px, py, pz, tx, ty, tz) {
  perspectiveCamera.position.set(px, py, pz);
  perspectiveCamera.lookAt(tx, ty, tz);
  orthographicCamera.position.set(px, py, pz);
  orthographicCamera.lookAt(tx, ty, tz);
}

// Attach UI Button clicks
document.getElementById('btnToggleAnim')?.addEventListener('click', toggleAnimation);
document.getElementById('btnToggleCam')?.addEventListener('click', toggleCamera);
document.getElementById('btnToggleLight')?.addEventListener('click', toggleLightOrbit);
document.getElementById('btnResetCube')?.addEventListener('click', resetCube);

// ----------------------------------------------------------------------
// 7. Responsive Window Resize Handler (#56, #57, #58)
// ----------------------------------------------------------------------
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  aspect = sizes.width / sizes.height;

  // 1. Update Perspective Camera
  perspectiveCamera.aspect = aspect;
  perspectiveCamera.updateProjectionMatrix();

  // 2. Update Orthographic Camera
  orthographicCamera.left = (-frustumSize * aspect) / 2;
  orthographicCamera.right = (frustumSize * aspect) / 2;
  orthographicCamera.top = frustumSize / 2;
  orthographicCamera.bottom = -frustumSize / 2;
  orthographicCamera.updateProjectionMatrix();

  // 3. Update Renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// ----------------------------------------------------------------------
// 8. FPS & Telemetry Counters
// ----------------------------------------------------------------------
let frameCount = 0;
let lastFpsUpdate = performance.now();
let currentFps = 60;

const fpsStat = document.getElementById('fpsStat');
const cameraPosStat = document.getElementById('cameraPosStat');
const sceneStats = document.getElementById('sceneStats');
const cubePosStat = document.getElementById('cubePosStat');

function updateTelemetry(now) {
  frameCount++;
  if (now - lastFpsUpdate >= 500) {
    currentFps = Math.round((frameCount * 1000) / (now - lastFpsUpdate));
    frameCount = 0;
    lastFpsUpdate = now;
    if (fpsStat) fpsStat.textContent = `${currentFps} FPS`;
  }

  if (cameraPosStat) {
    cameraPosStat.textContent = `(${activeCamera.position.x.toFixed(1)}, ${activeCamera.position.y.toFixed(1)}, ${activeCamera.position.z.toFixed(1)})`;
  }

  if (sceneStats) {
    const meshCount = scene.children.filter((c) => c.isMesh).length;
    const triangles = renderer.info.render.triangles;
    sceneStats.textContent = `${meshCount} meshes | ${triangles} tris`;
  }

  if (cubePosStat) {
    cubePosStat.textContent = `(${cube.position.x.toFixed(2)}, ${cube.position.y.toFixed(2)}, ${cube.position.z.toFixed(2)})`;
  }
}

// ----------------------------------------------------------------------
// 9. Animation Loop (Frame-Rate Independent with Delta Time)
// ----------------------------------------------------------------------
function animate(currentTime) {
  requestAnimationFrame(animate);

  // Delta time dibatasi maksimal 0.05s untuk mencegah lonjakan saat tab tidak aktif
  const delta = Math.min(clock.getDelta(), 0.05);

  // 1. Pergerakan Otomatis (Jika animasi aktif)
  if (isAnimationRunning) {
    elapsed += delta;

    // Rotasi kontinu objek
    cube.rotation.y += 0.8 * delta;
    sphere.rotation.y += 0.5 * delta;

    // Animasi naik-turun sinusoidal pada sphere
    sphere.position.y = 0.75 + Math.sin(elapsed * 2.2) * 0.18;

    // Animasi Torus & Cylinder (Challenge A)
    torus.rotation.x += 1.0 * delta;
    torus.rotation.y += 0.7 * delta;
    torus.position.y = 0.85 + Math.cos(elapsed * 1.8) * 0.12;

    cylinder.rotation.y += 0.6 * delta;
    cone.rotation.y += 0.5 * delta;
  }

  // 2. Light Orbit Animation (Challenge D)
  if (isLightOrbiting) {
    const orbitSpeed = 0.6;
    const orbitRadius = 4.5;
    directionalLight.position.x = Math.cos(elapsed * orbitSpeed) * orbitRadius;
    directionalLight.position.z = Math.sin(elapsed * orbitSpeed) * orbitRadius;
    lightMarker.position.copy(directionalLight.position);
  }

  // 3. Continuous Keyboard Control for Cube (Challenge H)
  const moveSpeed = 2.4; // unit per second
  const rotSpeed = 2.0;  // radian per second

  if (keys.ArrowUp) cube.position.z -= moveSpeed * delta;
  if (keys.ArrowDown) cube.position.z += moveSpeed * delta;
  if (keys.ArrowLeft) cube.position.x -= moveSpeed * delta;
  if (keys.ArrowRight) cube.position.x += moveSpeed * delta;
  if (keys.KeyQ) cube.rotation.y += rotSpeed * delta;
  if (keys.KeyE) cube.rotation.y -= rotSpeed * delta;

  // Batasi posisi kubus agar tetap berada di atas ground
  cube.position.x = Math.max(-7, Math.min(7, cube.position.x));
  cube.position.z = Math.max(-7, Math.min(7, cube.position.z));

  // 4. Update HUD Telemetry
  updateTelemetry(currentTime);

  // 5. Render Scene dengan Active Camera
  renderer.render(scene, activeCamera);
}

// Jalankan loop animasi
animate(performance.now());

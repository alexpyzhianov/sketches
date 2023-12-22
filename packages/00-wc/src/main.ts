import * as THREE from "three";
import * as lil from "lil-gui";
import { toggleFullScreen } from "utils";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "./style.css";

// Config
const config = {
  controls: {
    dampingFactor: 0.05,
  },
};

// Set up the scene and renderer
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio)); // Support for Retina displays
document.body.appendChild(renderer.domElement);

// Set up an isometric camera
let aspect = window.innerWidth / window.innerHeight;
let camera = new THREE.OrthographicCamera(
  -50 * aspect,
  50 * aspect,
  50,
  -50,
  1,
  1000
);
camera.position.set(200, 200, 200);
camera.lookAt(scene.position);

// Configure controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // An inertia-like effect

// Create a single cube geometry (1x1x1)
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Create an InstancedMesh for the voxel cube
const numVoxels = 50 * 50 * 50;
const instancedMesh = new THREE.InstancedMesh(
  geometry,
  new THREE.MeshBasicMaterial(),
  numVoxels
);

// Assign random colors and positions to each voxel
let id = 0;
for (let x = 0; x < 50; x++) {
  for (let y = 0; y < 50; y++) {
    for (let z = 0; z < 50; z++) {
      const matrix = new THREE.Matrix4().setPosition(x - 25, y - 25, z - 25);
      instancedMesh.setMatrixAt(id, matrix);

      const color = new THREE.Color(
        Math.random(),
        Math.random(),
        Math.random()
      );
      instancedMesh.setColorAt(id, color);

      id++;
    }
  }
}

if (instancedMesh.instanceColor) {
  instancedMesh.instanceColor.needsUpdate = true;
}

// Add the instanced mesh to the scene
scene.add(instancedMesh);

// Resize handler
function onWindowResize() {
  aspect = window.innerWidth / window.innerHeight;
  camera.left = -50 * aspect;
  camera.right = 50 * aspect;
  camera.top = 50;
  camera.bottom = -50;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio)); // Adjust for Retina displays
}

window.addEventListener("resize", onWindowResize, false);
window.addEventListener("dblclick", toggleFullScreen(renderer.domElement));

// Configure GUI
const gui = new lil.GUI();
gui.title("water + color");

const controlsFolder = gui.addFolder("Controls");
controlsFolder
  .add(config.controls, "dampingFactor", 0, 0.1, 0.001)
  .onChange(() => {
    controls.dampingFactor = config.controls.dampingFactor;
  });
controlsFolder.close();

// Rendering function
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

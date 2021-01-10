import * as THREE from "three";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createCube } from "./cube";

import "./index.css";

const FRUSTUM_SIZE = 500;
const CUBE_ROWS = 10;
const CUBE_COLS = 10;
const CUBE_SIZE = 50;
const CUBE_PADDING = 1.2;

function setup() {
    const aspect = window.innerWidth / window.innerHeight;

    const camera = new THREE.OrthographicCamera(
        (FRUSTUM_SIZE * aspect) / -2,
        (FRUSTUM_SIZE * aspect) / 2,
        FRUSTUM_SIZE / 2,
        FRUSTUM_SIZE / -2,
        1,
        1000,
    );
    camera.position.set(1000, 1000, 1000);
    camera.lookAt(0, 0, 0);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const renderer = new CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minZoom = 0.5;
    controls.maxZoom = 2;

    return { camera, scene, renderer };
}

function main() {
    const { scene, camera, renderer } = setup();

    document.body.appendChild(renderer.domElement);

    for (let row = 0; row < CUBE_ROWS; row++) {
        for (let col = 0; col < CUBE_COLS; col++) {
            const cube = createCube(row, col, CUBE_SIZE, CUBE_PADDING);
            scene.add(cube);
        }
    }

    function onWindowResize() {
        const aspect = window.innerWidth / window.innerHeight;

        camera.left = (-FRUSTUM_SIZE * aspect) / 2;
        camera.right = (FRUSTUM_SIZE * aspect) / 2;
        camera.top = FRUSTUM_SIZE / 2;
        camera.bottom = -FRUSTUM_SIZE / 2;

        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    console.log(scene.children);

    function animate() {
        requestAnimationFrame(animate);

        scene.children.forEach((cube, i) => {
            cube.rotation.x += i * 0.001;
        });

        renderer.render(scene, camera);
    }

    window.addEventListener("resize", onWindowResize, false);
    animate();
}

main();

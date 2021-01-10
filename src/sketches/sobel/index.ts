import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { LuminosityShader } from "three/examples/jsm/shaders/LuminosityShader";
import { SobelOperatorShader } from "three/examples/jsm/shaders/SobelOperatorShader";

import "./index.css";

function setup() {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.1,
        200,
    );
    camera.position.set(0, 10, 25);
    camera.lookAt(scene.position);

    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const composer = new EffectComposer(renderer);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // const effectGrayScale = new ShaderPass(LuminosityShader);
    // composer.addPass(effectGrayScale);

    const effectSobel = new ShaderPass(SobelOperatorShader);
    effectSobel.uniforms["resolution"].value.x =
        window.innerWidth * window.devicePixelRatio;
    effectSobel.uniforms["resolution"].value.y =
        window.innerHeight * window.devicePixelRatio;
    composer.addPass(effectSobel);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);

        effectSobel.uniforms["resolution"].value.x =
            window.innerWidth * window.devicePixelRatio;
        effectSobel.uniforms["resolution"].value.y =
            window.innerHeight * window.devicePixelRatio;
    }

    window.addEventListener("resize", onWindowResize, false);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 10;
    controls.maxDistance = 100;

    return { scene, camera, renderer, composer };
}

function main() {
    const { scene, camera, renderer, composer } = setup();

    function create() {
        const geometry = new THREE.BoxGeometry(10, 10, 10);
        const material = new THREE.MeshPhongMaterial({ color: 0xffff00 });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 0.8);
        camera.add(pointLight);
        scene.add(camera);
    }

    document.body.appendChild(renderer.domElement);

    function animate() {
        requestAnimationFrame(animate);
        composer.render();
    }

    create();
    animate();
}

main();

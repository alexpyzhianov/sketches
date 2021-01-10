import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./index.css";

interface Screen {
    width: number;
    height: number;
}

function getCube() {
    const box = new THREE.BoxGeometry(100, 100, 100);

    return {
        body: new THREE.Mesh(
            box,
            new THREE.MeshBasicMaterial({ color: 0xffffff }),
        ),
        edges: new THREE.LineSegments(
            new THREE.EdgesGeometry(box),
            new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 4 }),
        ),
    };
}

function setup({ width, height }: Screen) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.OrthographicCamera(
        width / -2,
        width / 2,
        height / 2,
        height / -2,
        1,
        1000,
    );

    const renderer = new THREE.WebGLRenderer();

    new OrbitControls(camera, renderer.domElement);

    return { scene, camera, renderer };
}

function main() {
    const { scene, camera, renderer } = setup({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const { body, edges } = getCube();
    scene.add(body);
    scene.add(edges);

    camera.position.z = 150;
    camera.lookAt(0, 0, 0);

    renderer.setSize(innerWidth, innerHeight);

    document.body.appendChild(renderer.domElement);

    function view() {
        requestAnimationFrame(view);
        renderer.render(scene, camera);
    }

    view();
}

main();

import * as THREE from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";

const FACES = [
    {
        pos: new THREE.Vector3(0, 0, 0),
        rot: new THREE.Euler(-90 * THREE.MathUtils.DEG2RAD, 0, 0),
    },
    {
        pos: new THREE.Vector3(0, -0.5, -0.5),
        rot: new THREE.Euler(0, 0, 0),
    },
    {
        pos: new THREE.Vector3(0, -0.5, 0.5),
        rot: new THREE.Euler(0, 0, 0),
    },
    {
        pos: new THREE.Vector3(0.5, -0.5, 0),
        rot: new THREE.Euler(0, 90 * THREE.MathUtils.DEG2RAD, 0),
    },
    {
        pos: new THREE.Vector3(-0.5, -0.5, 0),
        rot: new THREE.Euler(0, 90 * THREE.MathUtils.DEG2RAD, 0),
    },
];

export function createCube(
    row: number,
    col: number,
    size: number,
    padding: number,
) {
    function createFace(pos: THREE.Vector3, rot: THREE.Euler) {
        const element = document.createElement("div");
        element.classList.add("cube-face");
        element.style.width = size + "px";
        element.style.height = size + "px";

        const object = new CSS3DObject(element);
        object.position
            .copy(pos)
            .multiplyScalar(size)
            .add(
                new THREE.Vector3(
                    row * size * padding,
                    0,
                    col * size * padding,
                ),
            );
        object.rotation.copy(rot);

        return object;
    }

    return FACES.reduce(
        (group, face) => group.add(createFace(face.pos, face.rot)),
        new THREE.Group(),
    );
}

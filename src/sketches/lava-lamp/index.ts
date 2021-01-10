import "./index.css";
import { ParticleSystem } from "./particle";

function getContainer() {
    const container = document.createElement("div");
    container.classList.add("container");

    return container;
}

function main() {
    const container = getContainer();
    document.body.appendChild(container);

    const system = new ParticleSystem({
        container,
        birthRate: 10,
        lifetimeRange: [100, 200],
    });

    function draw() {
        requestAnimationFrame(draw);
        system.tick();
    }

    draw();
}

main();

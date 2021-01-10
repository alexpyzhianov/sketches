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
        maxCount: 40,
        birthRate: 1,
        lifetimeRange: { min: 40, max: 70 },
    });

    function draw() {
        requestAnimationFrame(draw);
        system.tick();
    }

    draw();
}

main();

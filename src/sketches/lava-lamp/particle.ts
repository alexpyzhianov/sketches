import { vec2 } from "gl-matrix";

export interface ParticleSystemParams {
    container: HTMLElement;
    birthRate: number;
    lifetimeRange: [number, number];
}

export class ParticleSystem {
    birthRate: number;
    particles: Particle[];
    container: HTMLElement;
    lifetimeRange: [number, number];

    constructor(params: ParticleSystemParams) {
        this.container = params.container;
        this.birthRate = params.birthRate;
        this.lifetimeRange = params.lifetimeRange;
        this.particles = [];
    }

    tick() {
        this.manageExiting();
        this.makeMore();
    }

    private manageExiting() {
        this.particles.forEach((p, i) => {
            if (p.alive()) {
                p.update();
                p.draw();
            } else {
                this.container.removeChild(p.element);
                this.particles.splice(i, 1);
            }
        });
    }

    private makeMore() {
        const newParticles = Array(this.birthRate)
            .fill(undefined)
            .map(() => this.makeParticle(this.lifetimeRange));

        this.particles = this.particles.concat(newParticles);
        newParticles.forEach((p) => this.container.appendChild(p.element));
    }

    private makeParticle([minLifetime, maxLifetime]: [number, number]) {
        const { width, height } = this.container.getBoundingClientRect();

        return new Particle({
            lifetime: minLifetime + Math.random() * (maxLifetime - minLifetime),
            position: vec2.fromValues(width / 2, height / 2),
            accelerationValue: 0.05,
        });
    }
}

export interface ParticleParams {
    lifetime: number;
    position: vec2;
    accelerationValue: number;
}

export class Particle {
    element: HTMLDivElement;

    private lifetime: number;
    private position: vec2;
    private velocity: vec2;
    private acceleration: vec2;

    constructor(params: ParticleParams) {
        this.lifetime = params.lifetime;

        this.position = params.position;
        this.velocity = vec2.fromValues(0, 0);

        this.acceleration = vec2.fromValues(params.accelerationValue, 0);
        this.setInitialRotation();

        this.element = document.createElement("div");
        this.element.classList.add("particle");

        this.draw();
    }

    update() {
        vec2.add(this.position, this.position, this.velocity);
        vec2.add(this.velocity, this.velocity, this.acceleration);
        this.lifetime -= 1;
    }

    draw() {
        const [x, y] = this.position;
        this.element.style.transform = `translate(${x}px, ${y}px)`;
    }

    alive() {
        return this.lifetime > 0;
    }

    // Rotates the acceleration vector to point in a random direction
    private setInitialRotation() {
        vec2.rotate(
            this.acceleration,
            this.acceleration,
            vec2.fromValues(0, 0),
            Math.PI * 2 * Math.random(),
        );
    }
}

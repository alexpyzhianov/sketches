import { vec2 } from "gl-matrix";

export interface ParticleSystemParams {
    container: HTMLElement;
    maxCount: number;
    birthRate: number;
    lifetimeRange: { min: number; max: number };
}

export class ParticleSystem {
    private birthRate: number;
    private maxCount: number;
    private particles: Particle[];
    private container: HTMLElement;
    private lifetimeRange: { min: number; max: number };
    private origin: { x: number; y: number };

    constructor(params: ParticleSystemParams) {
        this.container = params.container;
        const { width, height } = this.container.getBoundingClientRect();

        this.origin = { x: width / 2, y: height / 2 };

        this.maxCount = params.maxCount;
        this.birthRate = params.birthRate;
        this.lifetimeRange = params.lifetimeRange;
        this.particles = [];
    }

    tick() {
        this.manageExiting();

        if (this.particles.length < this.maxCount) {
            this.makeMore();
        }
    }

    private manageExiting() {
        this.particles.forEach((p, i) => {
            if (p.alive()) {
                p.update();
                p.draw();
            } else {
                p.reset();
            }
        });
    }

    private makeMore() {
        for (let i = 0; i < this.birthRate; i++) {
            const newParticle = this.makeParticle();
            this.particles.push(newParticle);
            this.container.appendChild(newParticle.element);
        }
    }

    private makeParticle() {
        return new Particle({
            lifetime:
                this.lifetimeRange.min +
                Math.random() *
                    (this.lifetimeRange.max - this.lifetimeRange.min),
            origin: vec2.fromValues(this.origin.x, this.origin.y),
            accelerationValue: 0.05,
        });
    }
}

export interface ParticleParams {
    lifetime: number;
    origin: vec2;
    accelerationValue: number;
}

export class Particle {
    element: HTMLDivElement;

    private lifetime: number;
    private origin: vec2;
    private accelerationValue: number;

    private life: number;
    private position: vec2;
    private velocity: vec2;
    private acceleration: vec2;

    constructor(params: ParticleParams) {
        this.lifetime = params.lifetime;
        this.origin = params.origin;
        this.accelerationValue = params.accelerationValue;

        this.element = document.createElement("div");
        this.element.classList.add("particle");

        //reset
        this.life = this.lifetime;

        this.position = vec2.fromValues(this.origin[0], this.origin[1]);
        this.velocity = vec2.fromValues(0, 0);
        this.acceleration = vec2.fromValues(this.accelerationValue, 0);

        vec2.rotate(
            this.acceleration,
            this.acceleration,
            vec2.fromValues(0, 0),
            Math.PI * 2 * Math.random(),
        );

        this.draw();
    }

    reset() {
        this.life = this.lifetime;

        this.position = vec2.fromValues(this.origin[0], this.origin[1]);
        this.velocity = vec2.fromValues(0, 0);
        this.acceleration = vec2.fromValues(this.accelerationValue, 0);

        vec2.rotate(
            this.acceleration,
            this.acceleration,
            vec2.fromValues(0, 0),
            Math.PI * 2 * Math.random(),
        );

        this.draw();
    }

    update() {
        vec2.add(this.position, this.position, this.velocity);
        vec2.add(this.velocity, this.velocity, this.acceleration);
        this.life -= 1;
    }

    draw() {
        const [x, y] = this.position;
        this.element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    alive() {
        return this.life > 0;
    }
}

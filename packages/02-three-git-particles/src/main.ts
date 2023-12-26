import { Pane } from "tweakpane";
import gsap from "gsap";
import { createWebGL2Canvas, createShaderProgram } from "utils";
import vertexShaderSource from "./main.vert";
import fragmentShaderSource from "./main.frag";

const MAX_COMMIT_COUNT = 10000000;
const MIN_COMMIT_COUNT = 100;
const MIN_POINT_SIZE = 5;
const MAX_POINT_SIZE = 20;
const MIN_RADIUS = 0.1;
const MAX_RADIUS = 3;

const PARAMS = {
  commitCount: MAX_COMMIT_COUNT,
  pointSize: MIN_POINT_SIZE,
  radius: 2,
};

const pane = new Pane();

pane.addBinding(PARAMS, "pointSize", {
  min: MIN_POINT_SIZE,
  max: MAX_POINT_SIZE,
  step: 1,
});
pane.addBinding(PARAMS, "commitCount", {
  min: MIN_COMMIT_COUNT,
  max: MAX_COMMIT_COUNT,
  step: MIN_COMMIT_COUNT,
});
pane.addBinding(PARAMS, "radius", {
  min: MIN_RADIUS,
  max: MAX_RADIUS,
  step: 0.01,
});

const dpr = window.devicePixelRatio || 1;
const width = 600 * dpr;
const height = 600 * dpr;

const { gl } = createWebGL2Canvas(width, height, dpr);
if (!gl) {
  throw new Error("WebGL2 is not available in your browser.");
}

let data = new Float32Array(PARAMS.commitCount * 2);

for (let i = 0; i < PARAMS.commitCount; i++) {
  data[i * 2] = i;
  data[i * 2 + 1] = Math.round(Math.random());
}

const shaderProgram = createShaderProgram(gl, {
  vertexShaderSource,
  fragmentShaderSource,
});

const dataAttributeLocation = gl.getAttribLocation(shaderProgram, "aData");

const dataBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

const timeUniformLocation = gl.getUniformLocation(shaderProgram, "uTime");
const countUniformLocation = gl.getUniformLocation(shaderProgram, "uCount");
const pointSizeUniformLocation = gl.getUniformLocation(
  shaderProgram,
  "uPointSize"
);
const radiusUniformLocation = gl.getUniformLocation(shaderProgram, "uRadius");

function draw() {
  if (!gl) {
    throw new Error("WebGL2 is not available in your browser.");
  }

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(shaderProgram);
  gl.enableVertexAttribArray(dataAttributeLocation);

  gl.uniform1f(timeUniformLocation, performance.now() / 1000);
  gl.uniform1f(countUniformLocation, PARAMS.commitCount);
  gl.uniform1f(pointSizeUniformLocation, PARAMS.pointSize);
  gl.uniform1f(radiusUniformLocation, PARAMS.radius);

  gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
  gl.vertexAttribPointer(dataAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.POINTS, 0, PARAMS.commitCount);

  requestAnimationFrame(draw);
}

draw();

document.addEventListener("dblclick", () => {
  const timeline = gsap.timeline();

  timeline.to(PARAMS, {
    duration: 5,
    commitCount: MIN_COMMIT_COUNT,
    ease: "power2.out",
    yoyo: true,
    repeat: -1,
    repeatDelay: 0.5,
  });

  timeline.to(
    PARAMS,
    {
      duration: 5,
      pointSize: MAX_POINT_SIZE, // Assuming MAX_POINT_SIZE is the maximum size you want
      ease: "power4.in",
      yoyo: true,
      repeat: -1,
      repeatDelay: 0.5,
    },
    0
  );
});

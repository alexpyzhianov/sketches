import { Pane } from "tweakpane";
import gsap from "gsap";
import { createWebGL2Canvas, createShaderProgram } from "utils";
import vertexShaderSource from "./main.vert";
import fragmentShaderSource from "./main.frag";

const MAX_COMMIT_COUNT = 10000000;
const MIN_COMMIT_COUNT = 100;
const MIN_POINT_SIZE = 4;
const MAX_POINT_SIZE = 25;
const MIN_RADIUS = 0.1;
const MAX_RADIUS = 20;
const MIN_ROTATION = 0;
const MAX_ROTATION = Math.PI;

const PARAMS = {
  commitCount: MAX_COMMIT_COUNT,
  pointSize: MIN_POINT_SIZE,
  radius: MIN_RADIUS,
  rotation: MIN_ROTATION,
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
pane.addBinding(PARAMS, "rotation", {
  min: MIN_ROTATION,
  max: MAX_ROTATION,
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
  data[i * 2 + 1] = Math.random();
}

const { program: shaderProgram, error } = createShaderProgram(gl, {
  vertexShaderSource,
  fragmentShaderSource,
});
if (error || !shaderProgram) {
  throw error;
}

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
const rotationUniformLocation = gl.getUniformLocation(
  shaderProgram,
  "uRotation"
);

function draw() {
  if (!gl) {
    throw new Error("WebGL2 is not available in your browser.");
  }

  gl.clearColor(0.02, 0, 0.02, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(shaderProgram);
  gl.enableVertexAttribArray(dataAttributeLocation);

  gl.uniform1f(timeUniformLocation, performance.now() / 1000);
  gl.uniform1f(countUniformLocation, PARAMS.commitCount);
  gl.uniform1f(pointSizeUniformLocation, PARAMS.pointSize);
  gl.uniform1f(radiusUniformLocation, PARAMS.radius);
  gl.uniform1f(rotationUniformLocation, PARAMS.rotation);

  gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
  gl.vertexAttribPointer(dataAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.POINTS, 0, PARAMS.commitCount);

  requestAnimationFrame(draw);
}

draw();

document.addEventListener("dblclick", () => {
  const timeline = gsap.timeline();
  const commonParams = {
    duration: 6,
    yoyo: true,
    repeat: -1,
    repeatDelay: 0.5,
  };

  timeline.to(PARAMS, {
    commitCount: MIN_COMMIT_COUNT,
    ease: "power3.out",
    ...commonParams,
  });

  timeline.to(
    PARAMS,
    {
      pointSize: MAX_POINT_SIZE, // Assuming MAX_POINT_SIZE is the maximum size you want
      ease: "power4.in",
      ...commonParams,
    },
    0
  );

  timeline.to(
    PARAMS,
    {
      radius: MAX_RADIUS, // Assuming MAX_RADIUS is the maximum size you want
      ease: "power4.in",
      ...commonParams,
    },
    0
  );

  timeline.to(
    PARAMS,
    {
      rotation: MAX_ROTATION, // Assuming MAX_ROTATION is the maximum size you want
      ease: "power1.in",
      ...commonParams,
    },
    0
  );
});

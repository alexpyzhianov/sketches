import { setupWebGL2Canvas, createWebGL2Program } from "utils";
import vertexShaderSource from "./main.vert";
import fragmentShaderSource from "./main.frag";

const WIDTH = 800;
const HEIGHT = 600;

const { gl, error: glError } = setupWebGL2Canvas(WIDTH, HEIGHT);
if (glError) {
  document.body.innerHTML = glError.message;
  throw glError;
}

const { program, error: programError } = createWebGL2Program(gl, {
  vertexShaderSource,
  fragmentShaderSource,
});

if (programError) {
  document.body.innerHTML = programError.message;
  throw programError;
}

// Create a full-screen quad
const vertices = new Float32Array([
  -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
]);

const vao = gl.createVertexArray();
const vbo = gl.createBuffer();
gl.bindVertexArray(vao);
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
const positionLocation = gl.getAttribLocation(program, "a_position");
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionLocation);

// Render loop
function render() {
  if (!gl || !program) {
    throw new Error("Something went wrong");
  }

  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);

  // Add uniforms with width and height
  const widthLocation = gl.getUniformLocation(program, "u_width");
  const heightLocation = gl.getUniformLocation(program, "u_height");
  gl.uniform1f(widthLocation, WIDTH);
  gl.uniform1f(heightLocation, HEIGHT);

  gl.bindVertexArray(vao);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  requestAnimationFrame(render);
}

requestAnimationFrame(render);

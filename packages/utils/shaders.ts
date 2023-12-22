export const createWebGL2Program = (
  gl: WebGL2RenderingContext,
  shaders: {
    vertexShaderSource: string;
    fragmentShaderSource: string;
  }
) => {
  const vertShader = gl.createShader(gl.VERTEX_SHADER);
  if (!vertShader) {
    return { error: new Error("Failed to create vertex shader") };
  }

  gl.shaderSource(vertShader, shaders.vertexShaderSource);
  gl.compileShader(vertShader);
  if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
    return {
      error: new Error(
        "Failed to compile vertex shader: " + gl.getShaderInfoLog(vertShader)
      ),
    };
  }

  const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
  if (!fragShader) {
    return { error: new Error("Failed to create fragment shader") };
  }

  gl.shaderSource(fragShader, shaders.fragmentShaderSource);
  gl.compileShader(fragShader);
  if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
    return {
      error: new Error(
        "Failed to compile fragment shader: " + gl.getShaderInfoLog(fragShader)
      ),
    };
  }

  const program = gl.createProgram();
  if (!program) {
    return { error: new Error("Failed to create program") };
  }

  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);

  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return {
      error: new Error(
        "Failed to link program: " + gl.getProgramInfoLog(program)
      ),
    };
  }

  return { program };
};

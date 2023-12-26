export const createShader = (
  gl: WebGL2RenderingContext,
  type: number,
  source: string
) => {
  const shader = gl.createShader(type);
  if (!shader) {
    return { error: new Error("Failed to create shader") };
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return {
      error: new Error(
        `Failed to compile shader: ${gl.getShaderInfoLog(shader)}`
      ),
    };
  }

  return { shader };
};

export const createShaderProgram = (
  gl: WebGL2RenderingContext,
  shaders: {
    vertexShaderSource: string;
    fragmentShaderSource: string;
  }
) => {
  const vert = createShader(gl, gl.VERTEX_SHADER, shaders.vertexShaderSource);
  if ("error" in vert) {
    return { error: vert.error, program: undefined };
  }

  const frag = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    shaders.fragmentShaderSource
  );
  if ("error" in frag) {
    return { error: frag.error, program: undefined };
  }

  const program = gl.createProgram();
  if (!program) {
    return { error: new Error("Failed to create program") };
  }

  gl.attachShader(program, vert.shader);
  gl.attachShader(program, frag.shader);

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return { error: new Error("Failed to link program"), program: undefined };
  }

  gl.deleteShader(vert.shader);
  gl.deleteShader(frag.shader);

  return { program };
};

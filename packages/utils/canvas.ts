export const setup2DCanvas = (width = 800, height = 600) => {
  const ratio = Math.min(window.devicePixelRatio, 2) || 1;
  const canvas = document.createElement("canvas");

  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { error: new Error("Could not get 2D context") };
  }

  ctx.scale(ratio, ratio);

  return { ctx, canvas };
};

export const setupWebGL2Canvas = (width = 800, height = 600) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  document.body.appendChild(canvas);

  const gl = canvas.getContext("webgl2");
  if (!gl) {
    return { error: new Error("Could not get WebGL2 context") };
  }

  return { gl, canvas };
};

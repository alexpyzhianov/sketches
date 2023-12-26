export const createCanvas = (width = 800, height = 600, dpr = 1) => {
  const canvas = document.createElement("canvas");

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  document.body.appendChild(canvas);

  return canvas;
};

export const create2DCanvas = (width = 800, height = 600, dpr = 1) => {
  const canvas = createCanvas(width, height, dpr);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { error: new Error("Could not get 2D context") };
  }

  ctx.scale(dpr, dpr);

  return { ctx, canvas };
};

export const createWebGL2Canvas = (width = 800, height = 600, dpr = 1) => {
  const canvas = createCanvas(width / dpr, height / dpr, dpr);

  const gl = canvas.getContext("webgl2");
  if (!gl) {
    return { error: new Error("Could not get WebGL2 context") };
  }

  return { gl, canvas };
};

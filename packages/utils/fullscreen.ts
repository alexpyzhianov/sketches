export function toggleFullScreen(canvas: HTMLCanvasElement) {
  return function () {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      canvas.requestFullscreen().catch(console.error);
    }
  };
}

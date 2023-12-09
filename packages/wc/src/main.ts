import "./style.css";
import { setup2DCanvas } from "utils";

const { ctx, canvas, error } = setup2DCanvas();
if (error) {
  throw error;
}

// color canvas black
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

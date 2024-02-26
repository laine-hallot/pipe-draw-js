import { ActiveMouse } from '../types';

export const pencilTool = (ctx: CanvasRenderingContext2D) => {
  let previousPosition: { x: number | undefined; y: number | undefined } = {
    x: undefined,
    y: undefined,
  };

  let lineThickness = 6;

  const activate = () => {};

  let lastState = 'none';

  const update = (mouseData: ActiveMouse) => {
    if (mouseData.clickState !== lastState) {
      lastState = mouseData.clickState;
    }
    if (previousPosition.x !== undefined && previousPosition.y !== undefined) {
      if (mouseData.clickState === 'down') {
        drawLine(mouseData, {
          position: { x: previousPosition.x, y: previousPosition.y },
        });
      }
    }
    previousPosition.x = mouseData.position.x;
    previousPosition.y = mouseData.position.y;
  };

  const drawLine = (
    mouseData: ActiveMouse,
    previousState: {
      position: {
        x: number;
        y: number;
      };
    },
  ) => {
    let mouseX = mouseData.position.x;
    let mouseY = mouseData.position.y;

    // find all points between
    let x1 = mouseX,
      x2 = previousState.position.x,
      y1 = mouseY,
      y2 = previousState.position.y;

    let steep = Math.abs(y2 - y1) > Math.abs(x2 - x1);
    if (steep) {
      let x = x1;
      x1 = y1;
      y1 = x;

      let y = y2;
      y2 = x2;
      x2 = y;
    }
    if (x1 > x2) {
      let x = x1;
      x1 = x2;
      x2 = x;

      let y = y1;
      y1 = y2;
      y2 = y;
    }

    let dx = x2 - x1,
      dy = Math.abs(y2 - y1),
      error = 0,
      de = dy / dx,
      yStep = -1,
      y = y1;

    if (y1 < y2) {
      yStep = 1;
    }

    for (let x = x1; x < x2; x++) {
      if (steep) {
        ctx.fillRect(y, x, lineThickness, lineThickness);
      } else {
        ctx.fillRect(x, y, lineThickness, lineThickness);
      }

      error += de;
      if (error >= 0.5) {
        y += yStep;
        error -= 1.0;
      }
    }
  };

  const deactivate = () => {};

  return { activate, deactivate, update };
};

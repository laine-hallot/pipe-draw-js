export default Object.create(Object.prototype, {
  canvas: { value: undefined, writable: true },
  ctx: { value: undefined, writable: true },
  _screenShot: {
    value: undefined,
    writable: true,
  },
  screenShot: {
    configurable: false,
    get() {
      return this._screenShot;
    },
    set(value: HTMLImageElement) {
      this._screenShot = value;
      this.canvas.width = value.width;
      this.canvas.height = value.height;
      this.ctx.drawImage(value, 0, 0);
    },
  },
}) as {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  screenShot?: HTMLImageElement;
};

import canvasContext from './canvas-context';

window.bridge.sendImageData(async (event, settings) => {
  const image = await decodeImageData(settings.imageData);
  canvasContext.screenShot = image;
});

const decodeImageData = async (
  imageData: string,
): Promise<HTMLImageElement> => {
  const img = new Image(); // Create new img element
  img.src = `data:image/png;base64,${imageData}`;

  return await new Promise<HTMLImageElement>((resolve) => {
    img.decode().then(() => {
      resolve(img);
    });
  });
};

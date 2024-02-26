import { EditorSettings, MouseData } from './types';
import { pencilTool } from './canvas-tools/pencil';
import { paintBrushTool } from './canvas-tools/paint-brush';
import { trackPointer } from './pointer-tracking';
import canvasContext from './canvas-context';

const canvas = document.getElementById('editor') as HTMLCanvasElement | null;

const editorSettings: EditorSettings = {
  selectedTool: 'pencil',
  selectedColor: '#000000',
};

const buttonSetUp = () => {
  const toolButtons = document.querySelectorAll<HTMLButtonElement>(
    'button[data-tool-selector]',
  );
  toolButtons.forEach((button) => {
    button.addEventListener('click', () =>
      toolSelect(button.dataset.toolSelector as EditorSettings['selectedTool']),
    );
  });
  const colorSelector = document.getElementById(
    'color-selector',
  ) as HTMLInputElement;
  colorSelector?.addEventListener('change', (event) => {
    editorSettings.selectedColor = (event.target as HTMLInputElement)?.value;
  });

  const saveControlsContainer = document.getElementById(
    'save-controls',
  ) as HTMLInputElement;

  const saveButton = document.createElement('button');
  saveButton?.addEventListener('click', async (event) => {
    const blob = await canvasToBlob(canvasContext.canvas);
    saveBlob(blob, 'awa.png');
  });
  saveButton.innerText = 'Save';
  saveButton.classList.add('outlined-button');

  saveControlsContainer.appendChild(saveButton);

  const clipboardButton = document.createElement('button');
  clipboardButton?.addEventListener('click', async (event) => {
    const blob = await canvasToBlob(canvasContext.canvas);
    navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
  });
  clipboardButton.innerText = 'Copy to clipboard';
  clipboardButton.classList.add('outlined-button');

  saveControlsContainer.appendChild(clipboardButton);
};

const canvasToBlob = async (canvas: HTMLCanvasElement) => {
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((blob) => (blob !== null ? resolve(blob) : reject())),
  );
  return blob;
};
const saveBlob = (blob: Blob, fileName: string) => {
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.style.display = 'none';

  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};

let mouseData: MouseData = {
  isInElement: false,
  clickState: 'none',
  position: { x: undefined, y: undefined },
};

const debugXVal = document.querySelector('#debug-readout .x-pos .value');
const debugYVal = document.querySelector('#debug-readout .y-pos .value');
const debugClickStatus = document.querySelector(
  '#debug-readout .click-status .value',
);
const debugIsInElement = document.querySelector(
  '#debug-readout .is-in-element .value',
);
const debugSelectedTool = document.querySelector(
  '#debug-readout .selected-tool .value',
);
const debugSelectedColor = document.querySelector(
  '#debug-readout .selected-color .value',
);

const tools: Partial<Record<EditorSettings['selectedTool'], any>> = {};
let raf: number;
let lastFrame: ImageData | undefined = undefined;
const draw = (ctx: CanvasRenderingContext2D) => {
  debugXVal!.textContent = JSON.stringify(mouseData.position.x);
  debugYVal!.textContent = JSON.stringify(mouseData.position.y);
  debugClickStatus!.textContent = JSON.stringify(mouseData.clickState);
  debugIsInElement!.textContent = JSON.stringify(mouseData.isInElement);
  debugSelectedTool!.textContent = JSON.stringify(editorSettings.selectedTool);
  debugSelectedColor!.textContent = JSON.stringify(
    editorSettings.selectedColor,
  );
  if (ctx === null || ctx === undefined) {
    throw 'Unable to get canvas context';
  }

  ctx.fillStyle = editorSettings.selectedColor;

  if (mouseData.isInElement) {
    raf = window.requestAnimationFrame(() => {
      draw(ctx);
    });

    if (lastFrame !== undefined) {
      ctx.putImageData(lastFrame, 0, 0);
    }
    tools[editorSettings.selectedTool].update(mouseData);
    lastFrame = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.save();
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#000000';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.arc(
      mouseData.position.x + 3,
      mouseData.position.y + 3,
      6,
      0,
      2 * Math.PI,
    );
    ctx.stroke();

    ctx.restore();
  } else {
    window.cancelAnimationFrame(raf);
  }
};

const toolSelect = (tool: EditorSettings['selectedTool']) => {
  editorSettings.selectedTool = tool;
};

const registerTools = (ctx: CanvasRenderingContext2D) => {
  if (ctx === null || ctx === undefined) {
    throw 'Unable to get canvas context';
  }

  ctx.fillStyle = editorSettings.selectedColor;

  tools.pencil = pencilTool(ctx);
  tools.paintBrush = paintBrushTool(ctx);
};

const figuringStuffOut = () => {
  if (canvas === null) {
    throw 'Could not find canvas';
  }

  const ctx = canvas?.getContext('2d');
  if (ctx === null) {
    throw 'Could not get 2d context';
  }

  canvasContext.canvas = canvas;
  canvasContext.ctx = ctx;

  buttonSetUp();
  trackPointer(
    canvas,
    (update: Partial<MouseData>) => {
      // @ts-ignore
      mouseData = { ...mouseData, ...update };
    },
    { onEnter: () => draw(ctx) },
  );
  registerTools(ctx);
};

figuringStuffOut();

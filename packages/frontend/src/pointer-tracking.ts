import { MouseData } from './types';

export const trackPointer = (
  element: HTMLElement,
  updateMouseData: (update: Partial<MouseData>) => void,
  { onEnter }: { onEnter: () => void },
) => {
  element.addEventListener('pointerenter', (event) => {
    updateMouseData({
      isInElement: true,
      position: scopeCordsToElement(event.target as HTMLElement, {
        x: event.clientX,
        y: event.clientY,
      }),
    });
    onEnter();
  });
  element.addEventListener('pointerleave', (event) => {
    updateMouseData({
      ...updateMouseData,
      position: { x: undefined, y: undefined },
      clickState: 'none',
      isInElement: false,
    });
  });

  element.addEventListener('pointermove', (event) => {
    updateMouseData({
      ...updateMouseData,
      isInElement: true,
      position: scopeCordsToElement(event.target as HTMLElement, {
        x: event.clientX,
        y: event.clientY,
      }),
    });
  });

  element.addEventListener('pointerdown', (event) => {
    updateMouseData({
      isInElement: true,
      clickState: 'down',
      position: scopeCordsToElement(event.target as HTMLElement, {
        x: event.clientX,
        y: event.clientY,
      }),
    });
  });

  element.addEventListener('pointerup', (event) => {
    updateMouseData({
      isInElement: true,
      clickState: 'up',
      position: scopeCordsToElement(event.target as HTMLElement, {
        x: event.clientX,
        y: event.clientY,
      }),
    });
  });

  element.addEventListener('pointercancel', (event) => {
    console.log('Pointer cancel element');
  });

  element.addEventListener('pointerover', (event) => {
    console.log('Pointer over element');
  });
};

const scopeCordsToElement = (
  target: HTMLElement,
  mousePosition: { x: number; y: number },
): { x: number; y: number } => {
  return {
    x: mousePosition.x - target.offsetLeft,
    y: mousePosition.y - target.offsetTop - 49,
  };
};

export interface InactiveMouse {
  isInElement: false;
  clickState: 'none';
  position: { x: undefined; y: undefined };
}

export interface ActiveMouse {
  isInElement: true;
  clickState: 'up' | 'down' | 'none';
  position: { x: number; y: number };
}

export type MouseData = InactiveMouse | ActiveMouse;

export interface EditorSettings {
  selectedTool: 'pencil' | 'paintBrush' | 'text' | 'crop' | 'none';
  selectedColor: string;
}

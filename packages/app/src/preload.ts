// Import the necessary Electron modules
const contextBridge = require('electron').contextBridge;
const ipcRenderer = require('electron').ipcRenderer;

// Exposed protected methods in the render process
contextBridge.exposeInMainWorld(
  // Allowed 'ipcRenderer' methods
  'bridge',
  {
    // From main to render
    sendImageData: (message: any) => {
      ipcRenderer.on('sendImageData', message);
    },
  },
);

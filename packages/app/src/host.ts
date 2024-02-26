import path from 'path';
import fs from 'fs';
import { app, BrowserWindow, session } from 'electron';
import { PNG } from 'pngjs';

import { readCLiArgs } from './cli-args';

const readData = (args: any) => {
  if (args.file !== undefined) {
    console.log(args.file);
    return fs.readFileSync(args.file);
  }
  // Work on POSIX and Windows
  return fs.readFileSync(0); // STDIN_FILENO = 0
};

const createWindow = (windowDimensions: { width: number; height: number }) => {
  const win = new BrowserWindow({
    ...windowDimensions,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: true,
    },

    frame: false,
    transparent: true,
    alwaysOnTop: true,
    hasShadow: false,
    resizable: false,
  });
  win.visibleOnAllWorkspaces = true;
  return win;
};

const getImageDimensions = (stdinBuffer: Buffer) => {
  const { width, height } = PNG.sync.read(stdinBuffer);
  return { width, height };
};

export const startApp = () => {
  const args = readCLiArgs();

  const stdinBuffer = readData(args);

  const { width, height } = getImageDimensions(stdinBuffer);
  console.log({ width, height });

  const imageData = stdinBuffer.toString('base64');

  const windowDimensions = {
    width: width < 480 ? 600 : width + 120,
    height: height < 480 ? 620 : height + 200,
  };
  console.log(windowDimensions);

  app
    .whenReady()
    .then(() => {
      /* session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          "Content-Security-Policy": ["*"],
        },
      });
    }); */

      const window = createWindow(windowDimensions);
      window[true ? 'loadURL' : 'loadFile'](
        true
          ? 'http://localhost:3000/'
          : path.resolve('../../frontend/index.html'),
      ).then(() => {
        window.webContents.openDevTools();
        window.webContents.send('sendImageData', {
          imageData,
          canvasDimensions: { width, height },
        });
        window.webContents.addListener('dom-ready', () => {
          window.webContents.send('sendImageData', {
            imageData,
            canvasDimensions: { width, height },
          });
        });
      });
    })
    .catch((error: any) => console.log(error));

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
};

export interface IElectronAPI {
  sendImageData: (
    callBack: (event: any, settings: any) => Promise<void>,
  ) => void;
}

declare global {
  interface Window {
    bridge: IElectronAPI;
  }
}

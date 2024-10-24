import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import log from 'electron-log';

// Define Channels as a constant array (runtime value)
const channels = [
  'ipc-example',
  'dialog:openDirectory',
  'start-crawl',
  'stop-crawl',
  'crawl-output',
  'crawl-status',
] as const;

// Derive the TypeScript type from the channels array
export type Channels = (typeof channels)[number];

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      if (channels.includes(channel)) {
        // Now 'channels' is a runtime array
        ipcRenderer.send(channel, ...args);
      }
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      if (channels.includes(channel)) {
        const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
          func(...args);
        ipcRenderer.on(channel, subscription);

        return () => {
          ipcRenderer.removeListener(channel, subscription);
        };
      }
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      if (channels.includes(channel)) {
        ipcRenderer.once(channel, (_event, ...args) => func(...args));
      }
    },
  },
  dialog: {
    openDirectory: async (): Promise<string | null> => {
      try {
        const result = await ipcRenderer.invoke('dialog:openDirectory');
        if (result && result.length > 0) {
          return result[0];
        }
        return null;
      } catch (error) {
        console.error('Error opening directory:', error);
        return null;
      }
    },
  },
  crawl: {
    startCrawl: async (config: any) => {
      try {
        if (config && typeof config === 'object') {
          return await ipcRenderer.invoke('start-crawl', config);
        }
        throw new Error('Invalid crawl configuration.');
      } catch (error: any) {
        console.error('Error starting crawl:', error);
        throw error;
      }
    },
    stopCrawl: async () => {
      try {
        return await ipcRenderer.invoke('stop-crawl');
      } catch (error: any) {
        console.error('Error stopping crawl:', error);
        throw error;
      }
    },
    onCrawlOutput: (callback: (data: string) => void) => {
      ipcRenderer.on('crawl-output', (event, data) => {
        callback(data);
      });
    },
    onCrawlStatus: (callback: (status: string) => void) => {
      ipcRenderer.on('crawl-status', (event, status) => {
        callback(status);
      });
    },
  },
};

if (process.env.ENABLE_CRASH_REPORT === 'true') {
  log.transports.file.level = 'error';
  process.on('uncaughtException', (error) => {
    log.error('Uncaught Exception:', error);
  });
  process.on('unhandledRejection', (reason) => {
    log.error('Unhandled Rejection:', reason);
  });
}

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;

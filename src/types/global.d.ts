// src/types/global.d.ts

import { CrawlConfig } from './crawl';

export {};

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, ...args: unknown[]): void;
        on(channel: Channels, func: (...args: unknown[]) => void): () => void;
        once(channel: Channels, func: (...args: unknown[]) => void): void;
      };
      dialog: {
        openDirectory(): Promise<string | null>;
      };
      crawl: {
        startCrawl(config: CrawlConfig): Promise<void>;
        stopCrawl(): Promise<void>;
        onCrawlOutput(callback: (data: string) => void): void;
        offCrawlOutput(callback: (data: string) => void): void;
        onCrawlStatus(callback: (status: string) => void): void;
        offCrawlStatus(callback: (status: string) => void): void;
        // If you plan to implement these, uncomment them and ensure they're defined in Electron
        // onCrawlLog(callback: (log: string) => void): void;
        // offCrawlLog(callback: (log: string) => void): void;
        // onCrawlError(callback: (error: string) => void): void;
        // offCrawlError(callback: (error: string) => void): void;
      };
    };
  }
}

// Define the Channels type
type Channels =
  | 'ipc-example'
  | 'dialog:openDirectory'
  | 'start-crawl'
  | 'stop-crawl'
  | 'crawl-output'
  | 'crawl-status';

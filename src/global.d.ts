// src/global.d.ts

export {};

// Define the Channels type first
type Channels =
  | 'ipc-example'
  | 'dialog:openDirectory'
  | 'start-crawl'
  | 'stop-crawl'
  | 'crawl-output'
  | 'crawl-status';

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
        startCrawl(config: {
          url: string;
          match: string;
          selector: string;
          maxPagesToCrawl: number;
          outputDir: string;
          outputFileName: string;
        }): Promise<void>;
        stopCrawl(): Promise<void>;
        onCrawlOutput(callback: (data: string) => void): void;
        onCrawlStatus(callback: (status: string) => void): void;
      };
    };
  }
}

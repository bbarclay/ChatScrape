// src/renderer.d.ts

export {};

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage: (channel: string, ...args: unknown[]) => void;
        on: (channel: string, func: (...args: unknown[]) => void) => () => void;
        once: (channel: string, func: (...args: unknown[]) => void) => void;
      };
      dialog: {
        openDirectory: () => Promise<string | null>;
      };
      crawl: {
        startCrawl: (config: {
          url: string;
          match: string;
          selector: string;
          maxPagesToCrawl: number;
          outputDir: string;
          outputFileName: string;
        }) => Promise<void>;
        stopCrawl: () => Promise<void>;
        onCrawlOutput: (callback: (data: string) => void) => void;
        onCrawlStatus: (callback: (status: string) => void) => void;
      };
    };
  }
}

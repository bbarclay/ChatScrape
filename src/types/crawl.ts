import { Dispatch, SetStateAction } from 'react';

export interface CrawlProgress {
  current: number;
  total: number;
}

export interface CrawlStatus {
  cleanStatus: string;
  progress?: CrawlProgress;
}

export interface CrawlMessage {
  type: 'info' | 'error' | 'warning';
  content: string;
}

export interface CrawlConfig {
  url: string;
  match: string;
  selector: string;
  maxPagesToCrawl: number;
  outputDir: string;
  outputFileName: string;
}

export interface CrawlConfigurationProps {
  url: string;
  setUrl: Dispatch<SetStateAction<string>>;
  setCrawlDepth: Dispatch<SetStateAction<number>>;
  outputDir: string | null;
  setOutputDir: Dispatch<SetStateAction<string | null>>;
  handleSelectDirectory: () => Promise<void>; // Corrected to '() => Promise<void>' for async usage
  setCssSelector: Dispatch<SetStateAction<string>>;
  setMaxPages: Dispatch<SetStateAction<number>>;
  setCustomFileName: Dispatch<SetStateAction<string>>;
  setMatchPattern?: Dispatch<SetStateAction<string>>;
  crawlStatus: string;
  customFileName: string;
  cssSelector: string;
  crawlDepth: number;
  maxPages: number;
  matchPattern?: string;
  isCrawling: boolean;
  finishedRequests: number;
  totalRequests: number;
  startCrawl: () => Promise<void>;
  stopCrawl: () => Promise<void>;
}

export interface OutputDisplayProps {
  output: string;
  clearOutput: () => void;
}

export type ParsedCrawlStatus = {
  cleanStatus: string;
  progress: CrawlProgress | null;
};

export interface CrawlStatistics {
  totalPagesCrawled: number;
  totalErrors: number;
  totalWarnings: number;
  crawlDuration: number; // in seconds
  averageResponseTime: number; // in milliseconds
  requestsFinished: number;
  totalRequests: number;
  requestsFailed: number;
  requestAvgFinishedDurationMillis: number | null;
  requestsFinishedPerMinute: number;
  requestsFailedPerMinute: number;
  requestTotalDurationMillis: number;
  crawlerRuntimeMillis: number;
}

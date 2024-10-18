// src/context/CrawlContext.tsx

import React, { createContext, ReactNode } from 'react';
import useCrawl from '../hooks/useCrawl';
import { CrawlMessage, CrawlConfig } from '../types/crawl';

interface CrawlContextProps {
  output: CrawlMessage[];
  crawlStatus: string;
  isCrawling: boolean;
  totalRequests: number;
  finishedRequests: number;
  startCrawl: (config: CrawlConfig) => Promise<void>;
  stopCrawl: () => Promise<void>;
  clearOutput: () => void;
}

export const CrawlContext = createContext<CrawlContextProps | undefined>(undefined);

export const CrawlProvider = ({ children }: { children: ReactNode }) => {
  const crawl = useCrawl();

  return (
    <CrawlContext.Provider value={crawl}>
      {children}
    </CrawlContext.Provider>
  );
};

// src/hooks/useCrawl.ts

import { useState, useEffect } from 'react';
import {
  parseCrawlOutput,
  parseCrawlStatus,
} from '../utils/crawlUtils';

// Define the determineMessageType function
function determineMessageType(status: string): 'info' | 'error' | 'warning' {
  if (status === 'success') return 'info';
  if (status === 'failure') return 'error';
  return 'warning';
}

// Usage in the code
import { CrawlMessage, CrawlConfig, CrawlStatus } from '../types/crawl';

const useCrawl = () => {
  const [output, setOutput] = useState<CrawlMessage[]>([]);
  const [crawlStatus, setCrawlStatus] = useState<string>('');
  const [isCrawling, setIsCrawling] = useState<boolean>(false);
  const [totalRequests, setTotalRequests] = useState<number>(0);
  const [finishedRequests, setFinishedRequests] = useState<number>(0);

  useEffect(() => {
    const handleCrawlOutput = (data: string) => {
      const parsedMessages = parseCrawlOutput(data);
      setOutput((prev: CrawlMessage[]) => [...prev, ...parsedMessages]);  // Ensure proper type is used
    };

    const handleCrawlStatusUpdate = (status: string) => {
      const parsedStatus = parseCrawlStatus(status) as CrawlStatus;

      if (!parsedStatus.cleanStatus) return;

      const message: CrawlMessage = {
        type: determineMessageType(parsedStatus.cleanStatus),
        content: parsedStatus.cleanStatus,
      };

      setCrawlStatus(parsedStatus.cleanStatus);
      setOutput((prev: CrawlMessage[]) => [...prev, message]);

      if (parsedStatus.progress) {
        const { current, total } = parsedStatus.progress;
        setTotalRequests(total);
        setFinishedRequests(current);
      }

      const isFinished =
        parsedStatus.cleanStatus.toLowerCase().includes('finished') ||
        parsedStatus.cleanStatus.toLowerCase().includes('completed') ||
        parsedStatus.cleanStatus.toLowerCase().includes('shut down');

      if (isFinished) {
        setIsCrawling(false);
      }
    };

    // Subscribe to events
    window.electron.crawl.onCrawlOutput(handleCrawlOutput);
    window.electron.crawl.onCrawlStatus(handleCrawlStatusUpdate);

    // Cleanup on unmount
    return () => {
      window.electron.crawl.offCrawlOutput(handleCrawlOutput);
      window.electron.crawl.offCrawlStatus(handleCrawlStatusUpdate);
    };
  }, []);

  const startCrawl = async (config: CrawlConfig) => {
    try {
      setIsCrawling(true);
      await window.electron.crawl.startCrawl(config);
      setCrawlStatus('Crawl initiated...');
      setOutput((prev) => [
        ...prev,
        { type: 'info', content: 'Crawl initiated...' },
      ]);
    } catch (error: any) {
      console.error('Error initiating crawl:', error);
      setOutput((prev) => [
        ...prev,
        { type: 'error', content: `Error initiating crawl: ${error.message}` },
      ]);
      setIsCrawling(false);
    }
  };

  const stopCrawl = async () => {
    try {
      await window.electron.crawl.stopCrawl();
      setCrawlStatus('Crawl stopping...');
      setOutput((prev) => [
        ...prev,
        { type: 'info', content: 'Crawl stopping...' },
      ]);
    } catch (error: any) {
      console.error('Error stopping crawl:', error);
      setOutput((prev) => [
        ...prev,
        { type: 'error', content: `Error stopping crawl: ${error.message}` },
      ]);
    }
  };

  const clearOutput = () => {
    setOutput([]);
  };

  return {
    output,
    crawlStatus,
    isCrawling,
    totalRequests,
    finishedRequests,
    startCrawl,
    stopCrawl,
    clearOutput,
  };
};

export default useCrawl;

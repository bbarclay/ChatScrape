import React, { useState, useEffect, useRef } from 'react';
import 'tailwindcss/tailwind.css';
import './App.css';
import ErrorBoundary from './ErrorBoundary';
import CrawlConfiguration from '../components/CrawlConfiguration';
import OutputDisplay from '../components/OutputDisplay';
import Header from '../components/Header';
import {
  parseCrawlOutput,
  parseCrawlStatus,
  determineMessageType,
  CrawlMessage,
} from '../utils/outputParsing';

const getLocalStorageItem = (key: string, defaultValue: string) =>
  localStorage.getItem(key) || defaultValue;

function App() {
  const [config, setConfig] = useState({
    url: getLocalStorageItem('url', 'https://www.builder.io/c/docs/developers'),
    crawlDepth: parseInt(getLocalStorageItem('crawlDepth', '-1')),
    cssSelector: getLocalStorageItem('cssSelector', 'body'),
    maxPages: parseInt(getLocalStorageItem('maxPages', '5')),
    customFileName: getLocalStorageItem('customFileName', 'output.json'),
    outputDir: getLocalStorageItem('outputDir', ''),
  });

  const [output, setOutput] = useState<CrawlMessage[]>([]);
  const [crawlStatus, setCrawlStatus] = useState('');
  const [isCrawling, setIsCrawling] = useState(false);
  const [progress, setProgress] = useState({ total: 0, finished: 0 });
  const outputEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Object.entries(config).forEach(([key, value]) =>
      localStorage.setItem(key, value.toString()));
  }, [config]);

  useEffect(() => {
    const handleCrawlOutput = (data: string) => {
      const parsedMessages = parseCrawlOutput(data);
      setOutput(prev => [...prev, ...parsedMessages.filter(newMsg =>
        !prev.some(msg => msg.content === newMsg.content && msg.type === newMsg.type))]);
    };

    const handleCrawlStatusUpdate = (status: string) => {
      const { cleanStatus, progress } = parseCrawlStatus(status);
      if (!cleanStatus) return;

      const parsedStatus: CrawlMessage = {
        type: determineMessageType(cleanStatus),
        content: cleanStatus,
      };

      setCrawlStatus(cleanStatus);
      setOutput(prev => prev.some(msg =>
        msg.content === parsedStatus.content && msg.type === parsedStatus.type)
        ? prev : [...prev, parsedStatus]);

      if (progress) setProgress({ total: progress.total, finished: progress.current });

      const isFinished = ['finished', 'completed', 'shut down'].some(word =>
        cleanStatus.toLowerCase().includes(word));

      if (isFinished) {
        setIsCrawling(false);
        if (config.crawlDepth === 1) {
          setProgress(prev => ({ ...prev, finished: 1 }));
          setCrawlStatus('Crawl completed.');
          setOutput(prev => [...prev, { type: 'success', content: 'Crawl completed.' }]);
        }
      }
    };

    window.electron.crawl.onCrawlOutput(handleCrawlOutput);
    window.electron.crawl.onCrawlStatus(handleCrawlStatusUpdate);

    return () => {
      window.electron.crawl.onCrawlOutput(handleCrawlOutput);
      window.electron.crawl.onCrawlStatus(handleCrawlStatusUpdate);
    };
  }, [config.crawlDepth]);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const handleSelectDirectory = async () => {
    try {
      const directory = await window.electron.dialog.openDirectory();
      if (directory) {
        setConfig(prev => ({ ...prev, outputDir: directory }));
      }
    } catch (error) {
      console.error('Failed to select directory:', error);
      alert('An error occurred while selecting the directory.');
    }
  };

  const startCrawl = async () => {
    if (!config.outputDir) {
      alert('Please select an output folder.');
      return;
    }

    if (!config.customFileName.endsWith('.json')) {
      alert('Output file name must have a .json extension.');
      return;
    }

    const cleanUrl = config.url.endsWith('/') ? config.url.slice(0, -1) : config.url;
    const matchPattern = config.crawlDepth === -1 ? `${cleanUrl}/**` :
                         config.crawlDepth === 2 ? `${cleanUrl}/*` :
                         config.crawlDepth === 3 ? `${cleanUrl}/*/*` : cleanUrl;

    setProgress({ total: config.crawlDepth === 1 ? 1 : 0, finished: 0 });

    const crawlConfig = {
      url: config.url,
      match: matchPattern,
      selector: config.cssSelector,
      maxPagesToCrawl: config.maxPages,
      outputDir: config.outputDir,
      outputFileName: config.customFileName,
    };

    try {
      setIsCrawling(true);
      await window.electron.crawl.startCrawl(crawlConfig);
      setCrawlStatus('Crawl initiated...');
      setOutput(prev => [...prev, { type: 'info', content: 'Crawl initiated...' }]);

      if (config.crawlDepth === 1) {
        setProgress({ total: 1, finished: 1 });
        setCrawlStatus('Crawl completed.');
        setOutput(prev => [...prev, { type: 'success', content: 'Crawl completed.' }]);
        setIsCrawling(false);
      }
    } catch (error: any) {
      console.error('Error initiating crawl:', error);
      setOutput(prev => [...prev, { type: 'error', content: `Error initiating crawl: ${error.message}` }]);
      setIsCrawling(false);
    }
  };

  const stopCrawl = async () => {
    if (window.confirm('Are you sure you want to stop the crawl?')) {
      try {
        await window.electron.crawl.stopCrawl();
        setCrawlStatus('Crawl stopping...');
        setOutput(prev => [...prev, { type: 'info', content: 'Crawl stopping...' }]);
      } catch (error: any) {
        console.error('Error stopping crawl:', error);
        setOutput(prev => [...prev, { type: 'error', content: `Error stopping crawl: ${error.message}` }]);
      }
    }
  };

  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col">
        <Header isCrawling={isCrawling} />
        <div className="flex-1 container flex">
          <CrawlConfiguration
            {...config}
            setConfig={setConfig}
            startCrawl={startCrawl}
            stopCrawl={stopCrawl}
            handleSelectDirectory={handleSelectDirectory}
            crawlStatus={crawlStatus}
            isCrawling={isCrawling}
            finishedRequests={progress.finished}
            totalRequests={progress.total}
          />
          <div className="flex-1 overflow-y-auto h-[calc(100vh-4rem)]">
            <OutputDisplay
              output={output}
              outputEndRef={outputEndRef}
              clearOutput={() => setOutput([])}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;

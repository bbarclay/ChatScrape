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

function App() {
  const [url, setUrl] = useState<string>(
    localStorage.getItem('url') || 'https://www.builder.io/c/docs/developers',
  );
  const [crawlDepth, setCrawlDepth] = useState<number>(
    parseInt(localStorage.getItem('crawlDepth') || '-1'),
  );
  const [cssSelector, setCssSelector] = useState<string>(
    localStorage.getItem('cssSelector') || 'body',
  );
  const [maxPages, setMaxPages] = useState<number>(
    parseInt(localStorage.getItem('maxPages') || '5'),
  );
  const [customFileName, setCustomFileName] = useState<string>(
    localStorage.getItem('customFileName') || 'output.json',
  );
  const [output, setOutput] = useState<CrawlMessage[]>([]);
  const [outputDir, setOutputDir] = useState<string | null>(
    localStorage.getItem('outputDir') || null,
  );
  const [crawlStatus, setCrawlStatus] = useState<string>('');
  const [isCrawling, setIsCrawling] = useState<boolean>(false);
  const [totalRequests, setTotalRequests] = useState<number>(0);
  const [finishedRequests, setFinishedRequests] = useState<number>(0);
  const outputEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedDirectory = localStorage.getItem('outputDir');
    if (savedDirectory) {
      setOutputDir(savedDirectory);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('url', url);
  }, [url]);

  useEffect(() => {
    localStorage.setItem('crawlDepth', crawlDepth.toString());
  }, [crawlDepth]);

  useEffect(() => {
    localStorage.setItem('cssSelector', cssSelector);
  }, [cssSelector]);

  useEffect(() => {
    localStorage.setItem('maxPages', maxPages.toString());
  }, [maxPages]);

  useEffect(() => {
    localStorage.setItem('customFileName', customFileName);
  }, [customFileName]);

  useEffect(() => {
    const handleCrawlOutput = (data: string) => {
      const parsedMessages = parseCrawlOutput(data);
      setOutput((prev) => [...prev, ...parsedMessages]);
    };

    const handleCrawlError = (error: string) => {
      setOutput((prev) => [...prev, { type: 'error', content: error }]);
    };

    const handleCrawlStatusUpdate = (status: string) => {
      const { cleanStatus, progress } = parseCrawlStatus(status);

      if (!cleanStatus) return;

      const parsedStatus: CrawlMessage = {
        type: determineMessageType(cleanStatus),
        content: cleanStatus,
      };

      setCrawlStatus(cleanStatus);
      setOutput((prev) => [...prev, parsedStatus]);

      if (progress) {
        const { current, total } = progress;
        setTotalRequests(total);
        setFinishedRequests(current);
      }

      const isFinished =
        cleanStatus.toLowerCase().includes('finished') ||
        cleanStatus.toLowerCase().includes('completed') ||
        cleanStatus.toLowerCase().includes('shut down');

      if (isFinished) {
        setIsCrawling(false);
      }
    };

    const handleCrawlLog = (log: string) => {
      setOutput((prev) => [...prev, { type: 'info', content: log }]);
    };

    window.electron.crawl.onCrawlOutput(handleCrawlOutput);
    window.electron.crawl.onCrawlStatus(handleCrawlStatusUpdate);
    window.electron.crawl.onCrawlLog(handleCrawlLog);
    window.electron.crawl.onCrawlError(handleCrawlError);

  }, []);

  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output]);

  const handleSelectDirectory = async () => {
    try {
      const directory = await window.electron.dialog.openDirectory();
      if (directory) {
        setOutputDir(directory);
        localStorage.setItem('outputDir', directory);
      }
    } catch (error) {
      console.error('Failed to select directory:', error);
      alert('An error occurred while selecting the directory.');
    }
  };

  const startCrawl = async () => {
    if (!outputDir) {
      alert('Please select an output folder.');
      return;
    }

    if (!customFileName.endsWith('.json')) {
      alert('Output file name must have a .json extension.');
      return;
    }

    const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;

    let matchPattern = cleanUrl;
    if (crawlDepth === 2) {
      matchPattern = `${cleanUrl}/*`;
    } else if (crawlDepth === 3) {
      matchPattern = `${cleanUrl}/*/*`;
    } else if (crawlDepth === -1) {
      matchPattern = `${cleanUrl}/**`;
    }

    setTotalRequests(0);
    setFinishedRequests(0);

    const config = {
      url,
      match: matchPattern,
      selector: cssSelector,
      maxPagesToCrawl: maxPages,
      outputDir,
      outputFileName: customFileName,
    };

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
    const confirmStop = window.confirm(
      'Are you sure you want to stop the crawl?',
    );
    if (!confirmStop) return;

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

  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col">
        <Header isCrawling={isCrawling} />
        <div className="flex-1 container flex">
          <CrawlConfiguration
            startCrawl={startCrawl}
            stopCrawl={stopCrawl}
            outputDir={outputDir}
            handleSelectDirectory={handleSelectDirectory}
            setUrl={setUrl}
            setDepth={setCrawlDepth}
            setCssSelector={setCssSelector}
            setMaxPages={setMaxPages}
            setCustomFileName={setCustomFileName}
            crawlStatus={crawlStatus}
            url={url}
            depth={crawlDepth}
            cssSelector={cssSelector}
            maxPages={maxPages}
            customFileName={customFileName}
            isCrawling={isCrawling}
            finishedRequests={finishedRequests}
            totalRequests={totalRequests}
          />
          <div className="flex-1 overflow-y-auto h-[calc(100vh-4rem)]">
            <OutputDisplay
              output={output}
              outputEndRef={outputEndRef}
              clearOutput={clearOutput}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;


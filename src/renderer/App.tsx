import React, { useRef, useState } from 'react';
import 'tailwindcss/tailwind.css';
import './App.css';
import ErrorBoundary from './ErrorBoundary';
import CrawlConfiguration from '../components/CrawlConfiguration';
import OutputDisplay from '../components/OutputDisplay';
import Header from '../components/Header';
import { CrawlProvider } from '../context/CrawlContext';
import useLocalStorage from '../hooks/useLocalStorage';

function App() {
  // Using custom hook for localStorage
  const [url, setUrl] = useLocalStorage<string>('url', 'https://www.builder.io/c/docs/developers');
  const [crawlDepth, setCrawlDepth] = useLocalStorage<number>('crawlDepth', -1);
  const [cssSelector, setCssSelector] = useLocalStorage<string>('cssSelector', 'body');
  const [maxPages, setMaxPages] = useLocalStorage<number>('maxPages', 5);
  const [customFileName, setCustomFileName] = useLocalStorage<string>('customFileName', 'output.json');
  const [outputDir, setOutputDir] = useLocalStorage<string | null>('outputDir', null);
  const [output, setOutput] = useState<string[]>([]);

  const outputEndRef = useRef<HTMLDivElement>(null);

  // Define handleSelectDirectory function
  const handleSelectDirectory = async (): Promise<void> => {
    try {
      const result = await window.electron.ipcRenderer.invoke('select-directory');
      if (result.canceled) {
        console.log('Directory selection canceled');
        return;
      }
      const selectedDirectory = result.filePaths[0];
      setOutputDir(selectedDirectory);
      console.log('Selected directory:', selectedDirectory);
    } catch (error) {
      console.error('Error selecting directory:', error);
    }
  };
  
  // Define the crawl-related state and logic
  const [crawlStatus, setCrawlStatus] = useState<string>('idle');
  const [isCrawling, setIsCrawling] = useState<boolean>(false);
  const [finishedRequests, setFinishedRequests] = useState<number>(0);
  const [totalRequests, setTotalRequests] = useState<number>(0);

  const startCrawl = async () => {
    setIsCrawling(true);
    setCrawlStatus('crawling');
    setOutput([]);
    try {
      const result = await window.electron.ipcRenderer.invoke('start-crawl', {
        url,
        crawlDepth,
        cssSelector,
        maxPages,
        customFileName,
        outputDir
      });
      setOutput(prevOutput => [...prevOutput, result]);
    } catch (error) {
      console.error('Error during crawl:', error);
      setOutput(prevOutput => [...prevOutput, `Error: ${error.message}`]);
    } finally {
      setIsCrawling(false);
      setCrawlStatus('idle');
    }
  };

  const stopCrawl = async () => {
    setIsCrawling(false);
    setCrawlStatus('stopping');
    try {
      await window.electron.ipcRenderer.invoke('stop-crawl');
      setOutput(prevOutput => [...prevOutput, 'Crawl stopped']);
    } catch (error) {
      console.error('Error stopping crawl:', error);
      setOutput(prevOutput => [...prevOutput, `Error stopping crawl: ${error.message}`]);
    } finally {
      setCrawlStatus('idle');
    }
  };

  return (
    <ErrorBoundary>
      <CrawlProvider>
        <div className="h-screen flex flex-col">
          <Header />
          <div className="flex-1 container flex">
            <CrawlConfiguration
              url={url}
              setUrl={setUrl}
              crawlDepth={crawlDepth}
              setCrawlDepth={setCrawlDepth}
              cssSelector={cssSelector}
              setCssSelector={setCssSelector}
              maxPages={maxPages}
              setMaxPages={setMaxPages}
              customFileName={customFileName}
              setCustomFileName={setCustomFileName}
              outputDir={outputDir}
              setOutputDir={setOutputDir}
              handleSelectDirectory={handleSelectDirectory}
              crawlStatus={crawlStatus}
              isCrawling={isCrawling}
              finishedRequests={finishedRequests}
              totalRequests={totalRequests}
              startCrawl={startCrawl}
              stopCrawl={stopCrawl}
            />
            <div className="flex-1 overflow-y-auto h-[calc(100vh-4rem)]">
              <OutputDisplay output={output} clearOutput={() => setOutput([])} />
              <div ref={outputEndRef} />
            </div>
          </div>
        </div>
      </CrawlProvider>
    </ErrorBoundary>
  );
}

export default App;


import React, { useRef } from 'react';
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

  const outputEndRef = useRef<HTMLDivElement>(null);

  // Define handleSelectDirectory function
  const handleSelectDirectory = async (): Promise<void> => {
    console.log('Directory selection function invoked.');
    // Implementation for selecting directory
  };
  
  // Define the crawl-related state and logic
  const crawlStatus = "idle"; // Example value
  const isCrawling = false; // Example value
  const finishedRequests = 0; // Example value
  const totalRequests = 0; // Example value

  const startCrawl = async () => {
    console.log('Starting crawl...');
    // Logic to start crawling
  };

  const stopCrawl = async () => {
    console.log('Stopping crawl...');
    // Logic to stop crawling
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
              <OutputDisplay output={[]} clearOutput={() => {}} />
              <div ref={outputEndRef} />
            </div>
          </div>
        </div>
      </CrawlProvider>
    </ErrorBoundary>
  );
}

export default App;

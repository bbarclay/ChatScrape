import React from 'react';

interface CrawlConfigurationProps {
  startCrawl: () => Promise<void>;
  stopCrawl: () => Promise<void>;
  outputDir: string | null;
  handleSelectDirectory: () => Promise<void>;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  setCrawlDepth: React.Dispatch<React.SetStateAction<number>>;
  setCssSelector: React.Dispatch<React.SetStateAction<string>>;
  setMaxPages: React.Dispatch<React.SetStateAction<number>>;
  setCustomFileName: React.Dispatch<React.SetStateAction<string>>;
  setMatchPattern?: React.Dispatch<React.SetStateAction<string>>;
  crawlStatus: string;
  url: string;
  crawlDepth: number;
  cssSelector: string;
  maxPages: number;
  customFileName: string;
  matchPattern?: string;
  isCrawling: boolean;
  finishedRequests: number;
  totalRequests: number;
}

const CrawlConfiguration: React.FC<CrawlConfigurationProps> =
  function CrawlConfiguration({
    startCrawl,
    stopCrawl,
    outputDir,
    handleSelectDirectory,
    setUrl,
    setCrawlDepth,
    setCssSelector,
    setMaxPages,
    setCustomFileName,
    setMatchPattern,
    crawlStatus,
    url,
    crawlDepth,
    cssSelector,
    maxPages,
    customFileName,
    matchPattern = '',
    isCrawling,
    finishedRequests,
    totalRequests,
  }) {
    return (
      <div className="bg-white p-6 w-96 overflow-auto">
        <h2 className="text-2xl font-bold mb-4">Crawl Configuration</h2>

        {/* Output Directory Selection */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleSelectDirectory}
            className={`block w-full p-2 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 ${
              isCrawling ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isCrawling}
            aria-label="Select Output Folder"
          >
            Select Output Folder: {outputDir || 'Choose Directory'}
          </button>
          <p className="text-xs text-gray-500">
            Select your desired output folder (e.g., Documents/CrawlOutputs).
          </p>
        </div>

        {/* URL Input */}
        <div className="mb-4">
          <label
            htmlFor="url"
            className="block text-sm font-medium text-gray-700"
          >
            URL:
          </label>
          <input
            id="url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
            disabled={isCrawling}
          />
        </div>

        {/* Crawl Depth Input */}
        <div className="mb-4">
          <label
            htmlFor="crawlDepth"
            className="block text-sm font-medium text-gray-700"
          >
            Crawl Depth:
          </label>
          <input
            id="crawlDepth"
            type="number"
            value={crawlDepth}
            onChange={(e) => setCrawlDepth(parseInt(e.target.value, 10))}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            min="-1"
            required
            disabled={isCrawling}
          />
          <p className="text-xs text-gray-500">
            Set to -1 for unlimited depth, 0 for current page only, or a positive number for specific depth.
          </p>
        </div>

        {/* Optional: Match Pattern Input */}
        <div className="mb-4">
          <label
            htmlFor="matchPattern"
            className="block text-sm font-medium text-gray-700"
          >
            Optional: Match Pattern:
          </label>
          <input
            id="matchPattern"
            type="text"
            value={matchPattern}
            onChange={(e) => setMatchPattern && setMatchPattern(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="e.g., https://www.builder.io/c/docs/**"
            disabled={isCrawling}
          />
          <p className="text-xs text-gray-500">
            Specify a pattern to filter URLs (e.g.,
            https://www.builder.io/c/docs/**). Leave blank to include all URLs.
            This pattern will match links on the page for crawling.
          </p>
        </div>

        {/* CSS Selector Input */}
        <div className="mb-4">
          <label
            htmlFor="cssSelector"
            className="block text-sm font-medium text-gray-700"
          >
            CSS Selector:
          </label>
          <input
            id="cssSelector"
            type="text"
            value={cssSelector}
            onChange={(e) => setCssSelector(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
            disabled={isCrawling}
          />
        </div>

        {/* Max Pages Input */}
        <div className="mb-4">
          <label
            htmlFor="maxPages"
            className="block text-sm font-medium text-gray-700"
          >
            Max Pages to Crawl:
          </label>
          <input
            id="maxPages"
            type="number"
            value={maxPages}
            onChange={(e) => setMaxPages(parseInt(e.target.value, 10))}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            min="1"
            required
            disabled={isCrawling}
          />
        </div>

        {/* Custom Output File Name Input */}
        <div className="mb-4">
          <label
            htmlFor="customFileName"
            className="block text-sm font-medium text-gray-700"
          >
            Custom Output File Name:
          </label>
          <input
            id="customFileName"
            type="text"
            value={customFileName}
            onChange={(e) => setCustomFileName(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
            disabled={isCrawling}
          />
          <p className="text-xs text-gray-500">
            Ensure the file name ends with .json to prevent overwriting.
          </p>
        </div>

        {/* Progress Bar */}
        {isCrawling && (
          <div className="mb-4">
            <div className="flex items-center mb-1">
              <span className="block text-sm font-medium text-gray-700">
                Crawl Progress:
              </span>
            </div>
            <progress
              className="w-full h-4"
              value={finishedRequests}
              max={totalRequests}
              aria-label={`Crawl Progress: ${finishedRequests} of ${totalRequests} pages crawled`}
            >
              {`${finishedRequests} of ${totalRequests} pages crawled`}
            </progress>
            <p className="text-xs text-gray-500 mt-1">
              {`${finishedRequests} of ${totalRequests} pages crawled`}
            </p>
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={startCrawl}
            className={`flex-1 py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 ${
              isCrawling ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isCrawling}
          >
            Start Crawl
          </button>
          <button
            type="button"
            onClick={stopCrawl}
            className={`flex-1 py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 ${
              !isCrawling ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={!isCrawling}
          >
            Stop Crawl
          </button>
        </div>

        {/* Crawl Status */}
        {crawlStatus && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700">
              Status: {crawlStatus}
            </p>
          </div>
        )}
      </div>
    );
  };

CrawlConfiguration.defaultProps = {
  matchPattern: '',
  setMatchPattern: undefined,
};

export default CrawlConfiguration;


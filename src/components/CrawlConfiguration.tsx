// src/components/CrawlConfiguration.tsx
import React from 'react';
import { CrawlConfigurationProps } from '../types/crawl'; // Adjust path as needed


import OutputDirectorySelection from './CrawlConfigurationComponents/OutputDirectorySelection';
import UrlInput from './CrawlConfigurationComponents/UrlInput';
import CrawlDepthInput from './CrawlConfigurationComponents/CrawlDepthInput';
import MatchPatternInput from './CrawlConfigurationComponents/MatchPatternInput';
import CssSelectorInput from './CrawlConfigurationComponents/CssSelectorInput';
import MaxPagesInput from './CrawlConfigurationComponents/MaxPagesInput';
import CustomOutputFileNameInput from './CrawlConfigurationComponents/CustomOutputFileNameInput';
import ProgressBar from './CrawlConfigurationComponents/ProgressBar';
import ControlButtons from './CrawlConfigurationComponents/ControlButtons';
import CrawlStatus from './CrawlConfigurationComponents/CrawlStatus';

const CrawlConfiguration: React.FC<CrawlConfigurationProps> = ({
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
}) => {
  return (
    <div className="bg-white p-6 w-96 overflow-auto">
      <h2 className="text-2xl font-bold mb-4">Crawl Configuration</h2>

      <OutputDirectorySelection 
        outputDir={outputDir} 
        isCrawling={isCrawling} 
        handleSelectDirectory={handleSelectDirectory} 
      />
      <UrlInput url={url} setUrl={setUrl} isCrawling={isCrawling} />
      <CrawlDepthInput crawlDepth={crawlDepth} setCrawlDepth={setCrawlDepth} isCrawling={isCrawling} />
      <MatchPatternInput matchPattern={matchPattern} setMatchPattern={setMatchPattern} isCrawling={isCrawling} />
      <CssSelectorInput cssSelector={cssSelector} setCssSelector={setCssSelector} isCrawling={isCrawling} />
      <MaxPagesInput maxPages={maxPages} setMaxPages={setMaxPages} isCrawling={isCrawling} />
      <CustomOutputFileNameInput customFileName={customFileName} setCustomFileName={setCustomFileName} isCrawling={isCrawling} />
      <ProgressBar finishedRequests={finishedRequests} totalRequests={totalRequests} isCrawling={isCrawling} />
      <ControlButtons startCrawl={startCrawl} stopCrawl={stopCrawl} isCrawling={isCrawling} />
      <CrawlStatus crawlStatus={crawlStatus} />
    </div>
  );
};

CrawlConfiguration.defaultProps = {
  matchPattern: '',
  setMatchPattern: undefined,
};

export default CrawlConfiguration;

import React from 'react';

interface ControlButtonsProps {
  startCrawl: () => Promise<void>;
  stopCrawl: () => Promise<void>;
  isCrawling: boolean;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({ startCrawl, stopCrawl, isCrawling }) => {
  return (
    <div className="flex space-x-2">
      <button
        type="button"
        onClick={startCrawl}
        className={`flex-1 py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 ${isCrawling ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isCrawling}
      >
        Start Crawl
      </button>
      <button
        type="button"
        onClick={stopCrawl}
        className={`flex-1 py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 ${!isCrawling ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!isCrawling}
      >
        Stop Crawl
      </button>
    </div>
  );
};

export default ControlButtons;

import React from 'react';

interface ProgressBarProps {
  finishedRequests: number;
  totalRequests: number;
  isCrawling: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ finishedRequests, totalRequests, isCrawling }) => {
  if (!isCrawling) return null;

  return (
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
        ${` of  pages crawled`}
      </progress>
      <p className="text-xs text-gray-500 mt-1">
        ${` of  pages crawled`}
      </p>
    </div>
  );
};

export default ProgressBar;

import React from 'react';

interface CrawlStatusProps {
  crawlStatus: string;
}

const CrawlStatus: React.FC<CrawlStatusProps> = ({ crawlStatus }) => {
  if (!crawlStatus) return null;

  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-700">
        Status: {crawlStatus}
      </p>
    </div>
  );
};

export default CrawlStatus;

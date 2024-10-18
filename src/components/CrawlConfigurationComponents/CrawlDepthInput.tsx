import React from 'react';

interface CrawlDepthInputProps {
  crawlDepth: number;
  setCrawlDepth: React.Dispatch<React.SetStateAction<number>>;
  isCrawling: boolean;
}

const CrawlDepthInput: React.FC<CrawlDepthInputProps> = ({ crawlDepth, setCrawlDepth, isCrawling }) => {
  return (
    <div className="mb-4">
      <label htmlFor="crawlDepth" className="block text-sm font-medium text-gray-700">
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
  );
};

export default CrawlDepthInput;

import React from 'react';

interface MaxPagesInputProps {
  maxPages: number;
  setMaxPages: React.Dispatch<React.SetStateAction<number>>;
  isCrawling: boolean;
}

const MaxPagesInput: React.FC<MaxPagesInputProps> = ({ maxPages, setMaxPages, isCrawling }) => {
  return (
    <div className="mb-4">
      <label htmlFor="maxPages" className="block text-sm font-medium text-gray-700">
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
  );
};

export default MaxPagesInput;

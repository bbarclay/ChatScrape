import React from 'react';

interface OutputDirectorySelectionProps {
  outputDir: string | null;
  isCrawling: boolean;
  handleSelectDirectory: () => Promise<void>;
}

const OutputDirectorySelection: React.FC<OutputDirectorySelectionProps> = ({ outputDir, isCrawling, handleSelectDirectory }) => {
  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={handleSelectDirectory}
        className={`block w-full p-2 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 ${isCrawling ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isCrawling}
        aria-label="Select Output Folder"
      >
        Select Output Folder: ${outputDir || 'Choose Directory'}
      </button>
      <p className="text-xs text-gray-500">
        Select your desired output folder (e.g., Documents/CrawlOutputs).
      </p>
    </div>
  );
};

export default OutputDirectorySelection;

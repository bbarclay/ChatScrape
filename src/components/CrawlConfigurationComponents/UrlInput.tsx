import React from 'react';

interface UrlInputProps {
  url: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  isCrawling: boolean;
}

const UrlInput: React.FC<UrlInputProps> = ({ url, setUrl, isCrawling }) => {
  return (
    <div className="mb-4">
      <label htmlFor="url" className="block text-sm font-medium text-gray-700">
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
  );
};

export default UrlInput;

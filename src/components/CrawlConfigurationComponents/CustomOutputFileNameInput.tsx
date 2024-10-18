import React from 'react';

interface CustomOutputFileNameInputProps {
  customFileName: string;
  setCustomFileName: React.Dispatch<React.SetStateAction<string>>;
  isCrawling: boolean;
}

const CustomOutputFileNameInput: React.FC<CustomOutputFileNameInputProps> = ({ customFileName, setCustomFileName, isCrawling }) => {
  return (
    <div className="mb-4">
      <label htmlFor="customFileName" className="block text-sm font-medium text-gray-700">
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
  );
};

export default CustomOutputFileNameInput;

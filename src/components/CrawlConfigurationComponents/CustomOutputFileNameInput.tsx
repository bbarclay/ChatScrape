import React, { useState, useEffect } from 'react';

interface CustomOutputFileNameInputProps {
  customFileName: string;
  setCustomFileName: React.Dispatch<React.SetStateAction<string>>;
  isCrawling: boolean;
}

const CustomOutputFileNameInput: React.FC<CustomOutputFileNameInputProps> = ({ customFileName, setCustomFileName, isCrawling }) => {
  const [error, setError] = useState<string>('');

  useEffect(() => {
    validateFileName(customFileName);
  }, [customFileName]);

  const validateFileName = (fileName: string) => {
    const trimmedFileName = fileName.trim();
    if (trimmedFileName === '') {
      setError('File name cannot be empty');
    } else if (!trimmedFileName.endsWith('.json')) {
      setError('File name must end with .json');
    } else {
      setError('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFileName = e.target.value.trim();
    setCustomFileName(newFileName);
  };

  return (
    <div className="mb-4">
      <label htmlFor="customFileName" className="block text-sm font-medium text-gray-700">
        Custom Output File Name:
      </label>
      <input
        id="customFileName"
        type="text"
        value={customFileName}
        onChange={handleInputChange}
        className={`mt-1 block w-full p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md`}
        required
        disabled={isCrawling}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby="fileNameError"
      />
      {error && (
        <p id="fileNameError" className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
      <p className="text-xs text-gray-500 mt-1">
        The file name must end with .json to prevent overwriting.
      </p>
    </div>
  );
};

export default CustomOutputFileNameInput;


import React from 'react';

interface CssSelectorInputProps {
  cssSelector: string;
  setCssSelector: React.Dispatch<React.SetStateAction<string>>;
  isCrawling: boolean;
}

const CssSelectorInput: React.FC<CssSelectorInputProps> = ({ cssSelector, setCssSelector, isCrawling }) => {
  return (
    <div className="mb-4">
      <label htmlFor="cssSelector" className="block text-sm font-medium text-gray-700">
        CSS Selector:
      </label>
      <input
        id="cssSelector"
        type="text"
        value={cssSelector}
        onChange={(e) => setCssSelector(e.target.value)}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        required
        disabled={isCrawling}
      />
    </div>
  );
};

export default CssSelectorInput;

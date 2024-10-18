import React from 'react';

interface MatchPatternInputProps {
  matchPattern?: string;
  setMatchPattern?: React.Dispatch<React.SetStateAction<string>>;
  isCrawling: boolean;
}

const MatchPatternInput: React.FC<MatchPatternInputProps> = ({ matchPattern, setMatchPattern, isCrawling }) => {
  return (
    <div className="mb-4">
      <label htmlFor="matchPattern" className="block text-sm font-medium text-gray-700">
        Optional: Match Pattern:
      </label>
      <input
        id="matchPattern"
        type="text"
        value={matchPattern}
        onChange={(e) => setMatchPattern && setMatchPattern(e.target.value)}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
        placeholder="e.g., https://www.builder.io/c/docs/**"
        disabled={isCrawling}
      />
      <p className="text-xs text-gray-500">
        Specify a pattern to filter URLs (e.g., https://www.builder.io/c/docs/**). Leave blank to include all URLs.
      </p>
    </div>
  );
};

export default MatchPatternInput;

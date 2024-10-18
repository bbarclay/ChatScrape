// src/components/Header.tsx

import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBeer,
  faQuestionCircle,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { CrawlContext } from '../context/CrawlContext';

const Header: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const crawlContext = useContext(CrawlContext);

  if (!crawlContext) {
    throw new Error('Header must be used within a CrawlProvider');
  }

  const { isCrawling } = crawlContext;

  return (
    <div className="bg-gray-500 text-white p-4 flex justify-between items-center">
      {/* Title */}
      <h1 className="text-2xl">Web Crawler Dashboard</h1>

      {/* Icons */}
      <div className="flex items-center space-x-4">
        {/* Buy Me a Beer Icons */}
        <a
          href="https://buymeacoffee.com/bbarclay"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon
            icon={faBeer}
            size="2x"
            className="text-yellow-500 hover:text-yellow-600"
          />
        </a>

        {/* GitHub Icon */}
        <a
          href="https://github.com/bbarclay"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon
            icon={faGithub}
            size="2x"
            className="hover:text-gray-300"
          />
        </a>

        {/* Help Tooltip */}
        <div className="relative">
          <button onClick={() => setShowTooltip(!showTooltip)}>
            <FontAwesomeIcon
              icon={faQuestionCircle}
              size="2x"
              className="hover:text-gray-300"
            />
          </button>
          {showTooltip && (
            <div className="absolute top-8 right-0 bg-white text-black p-4 rounded shadow-lg z-10 w-80">
              <h4 className="font-semibold mb-2">Help & Documentation</h4>
              <p className="text-sm">
                Welcome to the Web Crawler Dashboard! Here you can configure and
                manage your web crawling tasks.
              </p>
              <ul className="list-disc list-inside text-sm mt-2">
                <li>
                  Configure the URL and crawl depth to target specific pages.
                </li>
                <li>Select the output directory to save crawl results.</li>
                <li>Monitor crawl progress and view detailed output logs.</li>
                <li>Start or stop the crawling process as needed.</li>
              </ul>
              <button
                onClick={() => setShowTooltip(false)}
                className="mt-2 text-xs text-gray-500 underline"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* Loading Spinner */}
        {isCrawling && (
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            size="2x"
            className="text-blue-300"
            title="Crawling in progress..."
            aria-label="Crawling in progress"
          />
        )}
      </div>
    </div>
  );
};

export default Header;

// src/components/OutputDisplay.tsx

import React, { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Message from './Message'; // Ensure the path is correct

interface OutputDisplayProps {
  output: { type: string; content: string }[];
  clearOutput: () => void; // Clear function
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({
  output,
  clearOutput,
}) => {
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const outputEndRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to bottom when new messages are added
  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [output]);

  // Function to scroll to the top of the message container
  const scrollToTop = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Function to scroll to the bottom of the message container
  const scrollToBottom = () => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="output flex flex-col bg-gray-100 p-4 h-full">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-100 z-10 py-2 sticky top-0">
        <h3 className="text-xl font-bold">Crawl Output</h3>
        <button
          onClick={clearOutput}
          className="text-red-500 hover:text-red-700"
          title="Clear Output"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>

      {/* Scrollable Message Area */}
      <div
        ref={messageContainerRef}
        className="flex-1 overflow-auto border border-gray-300 rounded-md p-2 bg-white"
      >
        {output.length === 0 ? (
          <p className="text-gray-500 text-center">No output to display.</p>
        ) : (
          output.map((msg, index) => (
            <Message key={index} type={msg.type} content={msg.content} />
          ))
        )}
        <div ref={outputEndRef} />
      </div>

      {/* Fixed Footer with Scroll Buttons */}
      {output.length > 0 && (
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={scrollToTop}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow"
          >
            Scroll to Top
          </button>
          <button
            onClick={scrollToBottom}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow"
          >
            Scroll to Bottom
          </button>
        </div>
      )}
    </div>
  );
};

export default OutputDisplay;

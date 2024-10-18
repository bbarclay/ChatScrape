// src/components/Message.tsx

import React from 'react';

interface MessageProps {
  type: string;
  content: string;
}

const Message: React.FC<MessageProps> = ({ type, content }) => {
  let bgColor = 'bg-blue-100';
  let textColor = 'text-blue-800';

  switch (type) {
    case 'error':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    case 'warning':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      break;
    case 'success':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'info':
    default:
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
  }

  return (
    <div className={`p-2 rounded mb-2 ${bgColor} ${textColor}`} role="alert">
      {content}
    </div>
  );
};

export default Message;

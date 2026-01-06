import React from 'react';
import './ChatBot.css';

const ChatMessage = ({ message, isRTL }) => {
  return (
    <div 
      className={`chat-message-wrapper ${message.type} ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      
      <div className="message-bubble">
        <p className="message-text">{message.text}</p>
        <span className="message-time">{message.time}</span>
      </div>
      
    </div>
  );
};

export default ChatMessage;
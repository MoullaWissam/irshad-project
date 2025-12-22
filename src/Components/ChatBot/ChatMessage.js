import React from 'react';
import './ChatBot.css';

const ChatMessage = ({ message, isRTL }) => {
  return (
    <div 
      className={`chat-message-wrapper ${message.type} ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* تم حذف صورة البوت هنا */}
      
      <div className="message-bubble">
        <p className="message-text">{message.text}</p>
        <span className="message-time">{message.time}</span>
      </div>
      
      {/* تم حذف صورة المستخدم هنا */}
    </div>
  );
};

export default ChatMessage;
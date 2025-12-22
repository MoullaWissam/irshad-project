import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './ChatBot.css';
import murshed from '../../assets/images/Murshed.png';

const ChatIcon = ({ onOpen }) => {
  const { t } = useTranslation();
  const [pulse, setPulse] = useState(true);

  return (
    <button 
      className={`chat-icon ${pulse ? 'pulse' : ''}`}
      onClick={() => {
        setPulse(false);
        onOpen();
      }}
      aria-label={t('chatbot.open', 'فتح المساعد')}
    >
      <div className="chat-icon-inner">
        <img 
          src={murshed} 
          alt="Murshed Bot" 
          className="chat-icon-img"
        />
      </div>
      <span className="chat-tooltip">{t('chatbot.help', 'مساعدة')}</span>
    </button>
  );
};

export default ChatIcon;
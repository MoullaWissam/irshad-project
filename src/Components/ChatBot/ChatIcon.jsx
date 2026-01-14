import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './ChatBot.css';
import murshed from '../../assets/images/Murshed.png';

const ChatIcon = ({ onOpen }) => {
  const { t } = useTranslation();
  const [pulse, setPulse] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div 
      className={`floating-icon-container ${pulse ? 'pulse' : ''}`}
      onClick={() => {
        setPulse(false);
        onOpen();
      }}
      role="button"
      tabIndex={0}
      aria-label={t('chatbot.open', 'فتح المساعد')}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setPulse(false);
          onOpen();
        }
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="floating-icon-canvas">
        <img 
          src={murshed} 
          alt="Murshed Bot" 
          className="chat-icon-img"
        />
      </div>
      {showTooltip && (
        <span className="floating-icon-tooltip">{t('chatbot.help', 'مساعدة')}</span>
      )}
    </div>
  );
};

export default ChatIcon;
import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import ChatMessage from './ChatMessage';
import './ChatBot.css';
import InteractiveAvatar from './InteractiveAvatar';

const ChatSidebar = forwardRef(({ isOpen, onClose }, ref) => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: t('chatbot.welcome', 'مرحباً! أنا "إرشاد بوت"، مساعدك الذكي في منصة إرشاد. كيف يمكنني مساعدتك اليوم؟'),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  const API_URL = 'http://127.0.0.1:8000';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessageText = inputValue;

    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: userMessageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch(`${API_URL}/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ msg: userMessageText }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const botAnswer = await response.text();

      const botMsg = {
        id: Date.now() + 1,
        type: 'bot',
        text: botAnswer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Error connecting to Flask:", error);
      const errorMsg = {
        id: Date.now() + 2,
        type: 'bot',
        text: 'عذراً، واجهت مشكلة في الاتصال بالسيرفر. تأكد من تشغيل ملف app.py',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  useImperativeHandle(ref, () => ({
    getMessages: () => messages,
    clearChat: () => setMessages([messages[0]])
  }));

  return (
    <div className={`chat-sidebar ${isOpen ? 'open' : ''}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="chat-sidebar-header">
        <div className="header-content">
          <div className="avatar-container">
            <InteractiveAvatar />
          </div>
          
          <div className="header-info">
            <h3>{t('chatbot.name', 'مرشد')}</h3>
            <p>{t('chatbot.status', 'مساعدك الذكي')}</p>
          </div>
        </div>
        
        <button onClick={onClose} className="close-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="chat-messages-container">
        <div className="chat-messages">
          {messages.map(message => (
            <ChatMessage 
              key={message.id} 
              message={message}
              isRTL={i18n.language === 'ar'}
            />
          ))}
          
          {isTyping && (
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <span>{t('chatbot.typing', 'إرشاد بوت يكتب...')}</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form className="chat-sidebar-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t('chatbot.placeholder', 'اكتب سؤالك هنا...')}
          dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
        />
        <button 
          type="submit" 
          className="chat-send-btn"
          disabled={!inputValue.trim() || isTyping}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </form>
    </div>
  );
});

export default ChatSidebar;
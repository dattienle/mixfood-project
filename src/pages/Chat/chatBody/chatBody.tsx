import React from 'react';
import './style.scss';

function ChatBody() {
  const messages = [
    { username: 'User 1', content: 'Hello there!' },
    { username: 'User 2', content: 'Hi! How are you?' },
    { username: 'User 1', content: 'I am good, thank you!' },
    { username: 'User 2', content: 'Great to hear!' },
  ];

  return (
    <div className="chat-body">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.username === 'User 1' ? 'sent' : 'received'}`}>
          <strong>{msg.username}:</strong> {msg.content}
        </div>
      ))}
    </div>
  );
}

export default ChatBody;

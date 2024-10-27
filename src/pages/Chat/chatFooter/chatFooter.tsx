import React, { useState } from 'react';
import './style.scss';
import {SendOutlined} from '@ant-design/icons'
function ChatFooter() {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message) {
      console.log('Message Sent:', message);
      setMessage('');
    }
  };

  return (
    <div className="chat-footer">
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSend}><SendOutlined /></button>
    </div>
  );
}

export default ChatFooter;

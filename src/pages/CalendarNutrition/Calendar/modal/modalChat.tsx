// src/components/ChatWindow.tsx
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Modal, Input, Button } from 'antd';
import './chat.scss'
import { CommonButton } from '../../../../UI/button/Button';
import { SendOutlined } from '@ant-design/icons'
const socket = io('https://chat-app-3i7k.onrender.com/'); // Update with your server IP

interface Message {
  _id: number;
  text: string;
  user: string;
  time: string;
  userId: number;
  appointmentId: number;
}

interface ChatWindowProps {
  visible: boolean;
  onClose: () => void;
  appointmentId: number;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ visible, onClose, appointmentId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${hours}:${minutes}, ${day}/${month}`;
  };

  useEffect(() => {
    socket.emit('fetchMessages', appointmentId);

    socket.on('messages', (loadedMessages: Message[]) => {
      setMessages(loadedMessages);
    });

    socket.on('newMessage', (newMessage: Message) => {
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('messages');
      socket.off('newMessage');
    };
  }, [appointmentId]);

  const onSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        _id: Date.now(),
        text: inputText,
        user: 'Chuyên gia',
        time: formatTime(new Date()),
        userId: 15,
        appointmentId: appointmentId,
      };

      socket.emit('sendMessage', newMessage);
      setInputText('');
    }
  };

  return (
    <Modal
      visible={visible}
      title="Chat"
      onCancel={onClose}
      footer={null}
      width={700}
      style={{ maxHeight: '60vh' }}
    >
      <div className="chat-container">
        <div className="messages">
          {messages.map(message => (
            <div key={message._id} className={`message ${message.user === 'Chuyên gia' ? 'sent' : 'received'}`}>
              <div className="message-sender">{message.user}</div>
              <div className="message-text">{message.text}</div>
              <div className="message-time">{message.time}</div>
            </div>
          ))}
        </div>
        <div className="input-container">
          <Input
            type="text"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
            style={{ flex: 1, marginRight: '8px' }} // Để ô nhập liệu chiếm không gian
          />
          <Button type="primary" icon={<SendOutlined />} style={{width: '65px'}} onClick={onSendMessage}>
            
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ChatWindow;
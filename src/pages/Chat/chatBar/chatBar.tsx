import React, { useState } from 'react';
import './style.scss';

import image from '../../../assets/avatar.jpg';
import { Avatar, Typography, Space, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ChatBar = () => {
  const initialContacts = [
    {
      name: 'John',
      status: 'online',
      img: image,
    },
    {
      name: 'Mary',
      status: 'online',
      img: image,
    },
    {
      name: 'Peter',
      status: 'online',
      img: image,
    },
  ];

  const [contacts, setContacts] = useState(initialContacts);
  const [searchTerm, setSearchTerm] = useState(''); 

  const handleSearch = (value: string) => {
    setSearchTerm(value);

    if (value === '') {
      // Nếu ô tìm kiếm trống, reset danh sách về ban đầu
      setContacts(initialContacts);
    } else {
      const filteredContacts = initialContacts.filter((contact) =>
        contact.name.toLowerCase().includes(value.toLowerCase())
      );
      setContacts(filteredContacts);
    }
  };

  return (
    <div className="chat__sidebar">
      <h2>Chats</h2>
      <div className='search-input'>
      <Input
        placeholder="Tìm kiếm theo tên"
        onChange={(e) => handleSearch(e.target.value)}
        style={{ width: 200 }}
        prefix={<SearchOutlined />}
      />
      </div>
     
      <div className="chat__header">Messages</div>
      <div className="chat__users">
        {contacts.map(({ name, status, img }) => {
          return (
            <div
              key={name}
              style={{ padding: '16px', display: 'flex', alignItems: 'center' }}
            >
              <Avatar src={img} size={50} />
              <Space direction="vertical" style={{ marginLeft: '12px' }}>
                <Text strong>{name}</Text>
                <Text type="secondary">{status}</Text>
              </Space>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatBar;

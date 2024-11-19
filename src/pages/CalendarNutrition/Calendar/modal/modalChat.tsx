// src/components/ChatWindow.tsx
import React, { useState } from 'react'
import { Modal, Input, Button, List } from 'antd'

interface ChatWindowProps {
  visible: boolean
  onClose: () => void
}

const ChatWindow: React.FC<ChatWindowProps> = ({ visible, onClose }) => {
  const [messages, setMessages] = useState<string[]>([])
  const [inputValue, setInputValue] = useState<string>('')

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, inputValue])
      setInputValue('') // Xóa ô nhập sau khi gửi
    }
  }

  return (
    <Modal
      visible={visible}
      title="Chat"
      onCancel={onClose}
      footer={null}
      width={400}
    >
      <List
        size="small"
        bordered
        dataSource={messages}
        renderItem={(item) => <List.Item>{item}</List.Item>}
        style={{ maxHeight: '300px', overflowY: 'auto' }}
      />
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onPressEnter={handleSendMessage}
        placeholder="Nhập tin nhắn..."
        style={{ marginTop: '16px' }}
      />
      <Button type="primary" onClick={handleSendMessage} style={{ marginTop: '8px' }}>
        Gửi
      </Button>
    </Modal>
  )
}

export default ChatWindow
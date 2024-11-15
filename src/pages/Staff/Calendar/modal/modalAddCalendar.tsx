// AddEventModal.tsx

import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, TimePicker, Button, InputNumber } from 'antd';
import { EventType } from '../../../../Models/calendar';


interface AddEventModalProps {
  visible: boolean;
  onAddEvent: (event: EventType) => void;
  onClose: () => void;
}

const ModalAddCanlendar: React.FC<AddEventModalProps> = ({ visible, onAddEvent, onClose }) => {
  const [form] = Form.useForm();


  return (
    <Modal
      title="Add New Event"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" >
          Add Event
        </Button>
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="date" label="Date" rules={[{ required: true, message: 'Please select a date!' }]}>
          <DatePicker />
        </Form.Item>
        <Form.Item name="time" label="Time Range" rules={[{ required: true, message: 'Please select a time range!' }]}>
          <TimePicker.RangePicker format="HH:mm" />
        </Form.Item>
        <Form.Item name="customerName" label="Customer Name" rules={[{ required: true, message: 'Please enter the customer name!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="message" label="Message" rules={[{ required: true, message: 'Please enter a message!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please enter the price!' }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="subPackage" label="Package Name" rules={[{ required: true, message: 'Please enter the package name!' }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalAddCanlendar;

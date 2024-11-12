import React from 'react';
import { Modal, Input, Button } from 'antd';
import Category from '../../../Models/categoryModel';



interface ModalAddCategoryProps {
    isOpen: boolean;
    handleOk: () => void;
    handleCancel: () => void;
    handleChange: (value: string, key: keyof Category) => void;
    formValues: Category;
}

const ModalAddCategory: React.FC<ModalAddCategoryProps> = ({
    isOpen,
    handleOk,
    handleCancel,
    handleChange,
    formValues
}) => {
    return (
        <Modal
            title="Add New Category"
            open={isOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            centered
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    Add
                </Button>,
            ]}
        >
            <Input
                placeholder="Name"
                value={formValues.name}
                onChange={e => handleChange(e.target.value, 'name')}
            />
        </Modal>
    );
};

export default ModalAddCategory;

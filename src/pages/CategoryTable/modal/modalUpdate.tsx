import { Button, Input, Modal } from "antd";
import Category from "~/Models/categoryModel";

interface ModalUpdateCategoryProps {
  isOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  handleChange: (value: string, key: keyof Category) => void;
  formValues: Category;
}
const ModalUpdateCategory: React.FC<ModalUpdateCategoryProps> = ({
  isOpen,
  handleOk,
  handleCancel,
  handleChange,
  formValues
}) => {
  return (
      <Modal
          title="Update Category"
          open={isOpen}
          onOk={handleOk}
          centered
          onCancel={handleCancel}
          footer={[
              <Button key="cancel" onClick={handleCancel}>
                  Cancel
              </Button>,
              <Button key="submit" type="primary" onClick={handleOk}>
                  Update
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

export default ModalUpdateCategory;

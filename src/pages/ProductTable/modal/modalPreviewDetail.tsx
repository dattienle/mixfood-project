import React from 'react';
import { Modal, Button, Avatar, Collapse,Tooltip  } from 'antd';
import { useQuery } from 'react-query';
// import { getPreviewDetails } from '~/api/templateSteps';
import './../style.scss';
import { getPreviewDetails } from '../../../api/templateSteps';

interface ModalPreviewDetailProps {
  isOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  dishId: number;
}

const ModalPreviewDetail: React.FC<ModalPreviewDetailProps> = ({ isOpen, handleOk, handleCancel, dishId }) => {
  const { data: ingredientDetail } = useQuery('ingredientDetail', getPreviewDetails);
  const dishData = ingredientDetail?.data.items.find((item: any) => item.dishId === dishId);

  const { Panel } = Collapse;

  return (
    <Modal
      title='Nguyên liệu chi tiết'
      open={isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      footer={[
        <Button key='cancel' onClick={handleCancel}>
          Hủy
        </Button>,
      ]}
      style={{ maxHeight: '60vh', overflowY: 'auto' }}
    >
      {dishData && dishData.ingredientType.length > 0 ? (
        <Collapse defaultActiveKey={dishData.ingredientType.map((_ : any, index: any) => index.toString())}>
          {dishData.ingredientType.map((ingredientType: any, index: number) => (
            <Panel header={ingredientType.name} key={index}>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {ingredientType.ingredient.map((ingredient: any, ingredientIndex: number) => (
                   <Tooltip title={ingredient.name} key={`${index}-${ingredientIndex}`}> {/* Added Tooltip here */}
                   <Avatar
                     src={ingredient.imageUrl}
                     size={64}
                     style={{ marginRight: '8px', marginBottom: '8px' }}
                   />
                 </Tooltip>
                ))}
              </div>
            </Panel>
          ))}
        </Collapse>
      ) : (
        <p>Không có nguyên liệu nào.</p>
      )}
    </Modal>
  );
};

export default ModalPreviewDetail;


import React from 'react';
import { Modal, Spin } from 'antd';
import { useQuery } from 'react-query';
import { getAccountById } from '../../../../api/accountApi';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: number; // Thông tin chứng chỉ

}

const CertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose, accountId }) => {
  const { data, isLoading, isError } = useQuery(
    ['accountDetail', accountId],
    () => getAccountById(accountId!),
    {
      enabled: !!accountId, // Chỉ gọi API khi accountId có giá trị
    }
  );
  console.log(data)
  return (
    <Modal title="Thông Tin Chứng Chỉ" visible={isOpen} onCancel={onClose} footer={null}>
      {isLoading ? (
        <Spin tip="Đang tải..." />
      ) : data ? (
        <div>
          <p><strong>Tên bằng cấp:</strong> {data.data.degreeName}</p>
          <p><strong>Tổ chức cấp:</strong> {data.data.institution}</p>
          <p><strong>Chuyên ngành:</strong> {data.data.fieldOfStudy}</p>
          <p><strong>Ngày tốt nghiệp:</strong> {data.data.graduationDate.split('T')[0]}</p>
          {data.data.imageUrl && (
            <div>
              <strong>Hình ảnh chứng chỉ:</strong>
              <img
                src={data.data.imageUrl}
                alt="Certificate"
                style={{ width: '100%', marginTop: '10px' }}
              />
            </div>
          )}
        </div>
      ) : (
        <p>Không có dữ liệu.</p>
      )}
    </Modal>
  );
};

export default CertificateModal;

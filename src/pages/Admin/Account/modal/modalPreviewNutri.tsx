import React from 'react'
import { Modal, Spin } from 'antd'
import { useQuery } from 'react-query'
import { getAccountById } from '../../../../api/accountApi'

interface CertificateModalProps {
  isOpen: boolean
  onClose: () => void
  accountId: number // Thông tin chứng chỉ
}

const CertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose, accountId }) => {
  const { data, isLoading, isError } = useQuery(['accountDetail', accountId], () => getAccountById(accountId!), {
    enabled: !!accountId // Chỉ gọi API khi accountId có giá trị
  })
  if (isError) {
    return (
      <Modal title='Thông Tin Chứng Chỉ' visible={isOpen} onCancel={onClose} footer={null}>
        <p>Đã xảy ra lỗi khi tải dữ liệu chứng chỉ.</p>
      </Modal>
    )
  }

  return (
    <Modal title='Thông Tin Chứng Chỉ' visible={isOpen} onCancel={onClose} footer={null}>
      {isLoading ? (
        <Spin tip='Đang tải...' />
      ) : data && data.data ? (
        <div>
          <p>
            <strong>Tên bằng cấp:</strong> {data.data.degreeName || 'Chưa có thông tin'}
          </p>
          <p>
            <strong>Tổ chức cấp:</strong> {data.data.institution || 'Chưa có thông tin'}
          </p>
          <p>
            <strong>Chuyên ngành:</strong> {data.data.fieldOfStudy || 'Chưa có thông tin'}
          </p>
          <p>
            <strong>Ngày tốt nghiệp:</strong> {data.data.graduationDate?.split('T')[0] || 'Chưa có thông tin'}
          </p>
          {data.data.imageUrl ? (
            <div>
              <strong>Hình ảnh chứng chỉ:</strong>
              <img src={data.data.imageUrl} alt='Certificate' style={{ width: '100%', marginTop: '10px' }} />
            </div>
          ) : (
            <p>Không có hình ảnh chứng chỉ.</p>
          )}
        </div>
      ) : (
        <p>Chưa có chứng chỉ.</p> // Display this if no certificate data is available
      )}
    </Modal>
  )
}

export default CertificateModal

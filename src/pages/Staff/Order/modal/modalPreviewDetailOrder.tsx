import React, { useEffect } from 'react'
import { Modal, Collapse, Spin } from 'antd'
import { Order } from '../../../../Models/order'
import { getOrderById } from '../../../../api/orderAPI'
import { useQuery } from 'react-query'

interface OrderDetailPageProps {
  visible: boolean
  onClose: () => void
  selectedOrderId: number
}

const OrderDetailPage: React.FC<OrderDetailPageProps> = ({ visible, onClose, selectedOrderId }) => {
  // useEffect(() => {
  //   console.log('selectedOrder changed:', selectedOrder);
  // }, [selectedOrder]);

  const {
    data: selectedOrderResonse,
    isLoading,
    error
  } = useQuery(['orderDetail', selectedOrderId], () => getOrderById(selectedOrderId), {
    enabled: !!selectedOrderId // Chỉ gọi API khi selectedOrderId không phải là null hoặc undefined
  })
  const selectedOrder = selectedOrderResonse?.data
  if (!selectedOrderId) {
    return <div>Không có đơn hàng chi tiết</div>
  }

  if (isLoading) {
    return <Spin tip='Đang tải chi tiết đơn hàng...' />
  }

  if (error) {
    return <div>Đã xảy ra lỗi khi tải chi tiết đơn hàng</div>
  }

  return (
    <Modal
      title="Chi Tiết Đơn Hàng"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ maxHeight: '70vh', overflowY: 'auto' }} 
    >
      {selectedOrder ? (
        <div>
          <h3>Thông Tin Đơn Hàng</h3>
          <p><strong>Mã đơn hàng:</strong> {selectedOrder.id}</p>
          <p><strong>Tên khách hàng:</strong> {selectedOrder.customerName}</p>
          <p><strong>Địa chỉ:</strong> {selectedOrder.address}</p>
          <p><strong>Số điện thoại:</strong> {selectedOrder.phone}</p>
          <h4>Sản Phẩm trong Đơn Hàng</h4>
          <Collapse>
            {selectedOrder.cartProducts && selectedOrder.cartProducts.length > 0 ? (
              selectedOrder.cartProducts.map((product: any, index: any) => (
                <Collapse.Panel header={product.dish.name} key={index}>
                  <p><strong>Giá:</strong> {product.price.toLocaleString()} VND</p>
                  <p><strong>Số lượng:</strong> {product.quantity}</p>
                  <p><strong>Nguyên liệu:</strong></p>
                  <ul>
                    {product.ingredient && Array.isArray(product.ingredient) ? (
                      product.ingredient.map((ing: any, i: any) => (
                        <li key={i}>{ing.name}</li>
                      ))
                    ) : (
                      <li>Không có nguyên liệu</li>
                    )}
                  </ul>
                </Collapse.Panel>
              ))
            ) : (
              <p>Không có sản phẩm nào trong đơn hàng</p>
            )}
          </Collapse>
        </div>
      ) : (
        <div>Không tìm thấy chi tiết đơn hàng</div>
      )}
    </Modal>
  )
}

export default OrderDetailPage

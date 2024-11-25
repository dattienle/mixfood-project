import React, { useEffect } from 'react'
import { Modal, Collapse, Spin } from 'antd'

import { useQuery } from 'react-query'
import './styles.scss'
import { getOrderById } from '../../../api/orderAPI'
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
      
      className="modal-order-detail"
    >
      {selectedOrder ? (
        <div className="order-content">
          <div className="order-header">
            <h3>Thông Tin Đơn Hàng</h3>
            <div className="order-info">
              <p><strong>Mã đơn hàng:</strong> <span>{selectedOrder.id}</span></p>
              <p><strong>Tên khách hàng:</strong> <span>{selectedOrder.customerName}</span></p>
              <p><strong>Địa chỉ:</strong> <span>{selectedOrder.address}</span></p>
              <p><strong>Số điện thoại:</strong> <span>{selectedOrder.phone}</span></p>
            </div>
          </div>

          <div className="order-products">
            <h4>Sản Phẩm trong Đơn Hàng</h4>
            <Collapse className="product-list">
              {selectedOrder.cartProducts && selectedOrder.cartProducts.length > 0 ? (
                selectedOrder.cartProducts.map((product: any, index: any) => (
                  <Collapse.Panel header={product.dish.name} key={index} className="product-item">
                    <div className="product-details">
                      <p><strong>Giá:</strong> <span>{product.price.toLocaleString()} VND</span></p>
                      <p><strong>Số lượng:</strong> <span>{product.quantity}</span></p>
                      <div className="ingredients">
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
                      </div>
                    </div>
                  </Collapse.Panel>
                ))
              ) : (
                <p className="no-products">Không có sản phẩm nào trong đơn hàng</p>
              )}
            </Collapse>
          </div>
        </div>
      ) : (
        <div className="no-order">Không tìm thấy chi tiết đơn hàng</div>
      )}
    </Modal>
  )
}

export default OrderDetailPage

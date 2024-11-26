import React, { useEffect } from 'react'
import { Modal, Collapse, Spin } from 'antd'
import { Order } from '../../../../Models/order'
import { getOrderById } from '../../../../api/orderAPI'
import { useQuery } from 'react-query'

import { getOrderChefById } from '../../../../api/chefApi'
import { CartProduct } from '../../../../Models/orderChef'
interface OrderDetailPageProps {
  visible: boolean
  onClose: () => void
  selectedOrderId: number
}

const OrderDetailChefPage: React.FC<OrderDetailPageProps> = ({ visible, onClose, selectedOrderId }) => {

const {Panel} = Collapse
  const {
    data: selectedOrderResonse,
    isLoading,
    error
  } = useQuery(['orderDetail', selectedOrderId], () => getOrderChefById(selectedOrderId), {
    enabled: !!selectedOrderId // Chỉ gọi API khi selectedOrderId không phải là null hoặc undefined
  })
  const selectedOrder = selectedOrderResonse?.data
  console.log(selectedOrder?.cartProducts)
  const cartProducts = selectedOrder?.cartProducts

  if (isLoading) {
    return <Spin tip='Đang tải chi tiết đơn hàng...' />
  }

  if (error) {
    return <div>Đã xảy ra lỗi khi tải chi tiết đơn hàng</div>
  }

  return (
  

    <Modal
    title="Thông Tin Chi Tiết"
    visible={visible}
      onCancel={onClose}
    footer={null}
    style={{ maxHeight: '70vh', overflowY: 'auto' }}
  >
    <Collapse>
      {cartProducts?.map((product: CartProduct, index: any) => (
       <Panel header={product.dish.name} key={index}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <img
                src={product.dish.imageUrl}
                alt={product.dish.name}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'contain',
                  borderRadius: '8px',
                }}
              />
              <p>
                <strong>Giá:</strong> {product.price.toLocaleString()} VND
              </p>
              <p>
                <strong>Số lượng:</strong> {product.quantity}
              </p>
              <p>
                <strong>Calo:</strong> {product.calo}
              </p>
              <p>
                <strong>Nguyên liệu:</strong>{' '}
                {product.ingredient && product.ingredient.length > 0
                  ? product.ingredient.map((ing) => ing.name).join(', ')
                  : 'Không có nguyên liệu'}
              </p>
            </div>
     </Panel>
      ))}
    </Collapse>
  </Modal>
  
  )
}

export default OrderDetailChefPage

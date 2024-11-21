export interface Ingredient {
  id: number;
  name: string;
}

export interface Dish {
  id: number;
  name: string;
  imageUrl: string;
}

export interface CartProduct {
  id: number;
  price: number;
  quantity: number;
  calo: number;
  dish: Dish;
  ingredient: Ingredient[];
}

export interface OrderChef {
  id: number;
  totalPrice: number;
  totalQuantity: number;
  orderDate: string; // Có thể sử dụng Date nếu bạn muốn xử lý ngày tháng
  customerName: string;
  address: string;
  phone: string;
  status: string;
  cartProducts: CartProduct[];
}
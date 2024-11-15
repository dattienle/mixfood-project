import Dish from "./DishModel";
import Ingredient from "./ingredientModel";


export interface CartProduct {
  id: number;
  price: number;
  quantity: number;
  dish: Dish;
  ingredient: Ingredient[];
  orderStatus?: string
}

export interface Order {
  id: number;
  totalPrice: number;
  totalQuantity: number;
  orderDate: string; 
  customerName: string;
  address: string;
  phone: string;
  status: string;
  cartProducts: CartProduct[];
}

import { Product } from "./ProductType";
import User from "./UserType";

export default interface OrderType {
  orders: Order[];
  total: number;
  limit: number;
  offset: number;
}

export interface Order {
  id: number;
  order_id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  price: string;
  subtotal: string;
  created_at: string;
  updated_at: string;
  user: User;
  product: Product;
  order: OrderDetails;
}

export interface OrderDetails {
  id: number;
  customer_id: number;
  vendor_id: number[];
  total: string;
  payment_method: string;
  shipping_status: string;
  shipping_method: string | null;
  shipping_fee: string;
  tracking_number: string | null;
  tracking_url: string | null;
  shipping_date: string | null;
  delivery_date: string | null;
  payment_date: string | null;
  payment_reference: string | null;
  payment_status: string;
  vendor_payment_settlement_status: string;
  cancel_reason: string | null;
  address_id: number | null;
  created_at: string;
  updated_at: string;
}

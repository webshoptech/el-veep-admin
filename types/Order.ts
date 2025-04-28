import { Product } from "./Product";
import User from "./User";

export interface OrderDetails {
  id: number;
  customer_id: number;
  vendor_id: number;
  total: string;
  payment_method: string;
  shipping_status: string;
  shipping_method: string;
  shipping_fee: string;
  tracking_number: string | null;
  tracking_url: string | null;
  shipping_date: string | null;
  delivery_date: string | null;
  payment_date: string;
  payment_reference: string;
  payment_status: string;
  vendor_payment_settlement_status: string;
  cancel_reason: string | null;
  address_id: number;
  created_at: string;
  updated_at: string;
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

 
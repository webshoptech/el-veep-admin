import axios from "@/app/lib/axios";  
import { OrderResponse } from "@/types/OrderType";

export async function getRecentOrders(
  limit: number,
  offset: number,
  search: string
) {
  const response = await axios.get("/orders", {
    params: { limit, offset, search },
  });
  return response.data;
}

export async function getOrderDetail(orderId: string): Promise<OrderResponse> {
  const response = await axios.get<OrderResponse>(`/orders/${orderId}`);
  return response.data;
}

export async function changeOrderStatus(orderId: number, status: string) {
  const response = await axios.put(`/orders/${orderId}/status`, {
    status,
  });
  return response.data;
}

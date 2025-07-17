import axios from "axios";
import { API_URL } from "../setting";
import { OrderResponse } from "@/types/OrderType";

export async function getRecentOrders(
    limit: number,
    offset: number,
    search: string
) {
    const response = await axios.get(`${API_URL}/orders`, {
        params: { limit, offset, search },
    });
    return response.data;
}

export async function getOrderDetail(orderId: string): Promise<OrderResponse> {
  const response = await axios.get<OrderResponse>(`${API_URL}/orders/${orderId}`);
  return response.data;
}

import axios from "axios";
import { API_URL } from "../setting";

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

export async function getOrderDetail(orderId: string) {
  const response = await axios.get(`${API_URL}/order/${orderId}`);
  return response.data;
}
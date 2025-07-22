import axios from "@/app/lib/axios";
import { OrderGraphPoint, OrderResponse, OrderStatsType } from "@/types/OrderType";

export async function getRecentOrders(
    limit: number,
    offset: number,
    search: string,
    status?: string
) {
    const response = await axios.get("/orders", {
        params: { limit, offset, search, status },
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

export async function getOrderGraph(start_date?: string): Promise<OrderGraphPoint[]> {
  const response = await axios.get<OrderGraphPoint[]>(`/orders/graph`, {
    params: { start_date },
  });
  return response.data;
}

export async function orderStats(): Promise<OrderStatsType> {
  const response = await axios.get<OrderStatsType>(`/orders/stats`);
  return response.data;
}


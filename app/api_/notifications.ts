import axios from "../lib/axios";
import { NotificationResponse } from "@/types/NotificationsType";

export async function getNotifications(params: {
  limit: number;
  offset: number;
  receiver?: string; 
}): Promise<NotificationResponse> {
  const response = await axios.get<NotificationResponse>('/notifications', {
    params,
  });
  return response.data;
}
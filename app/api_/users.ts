import axios from "axios";
import { API_URL } from "../setting";
export async function getRecentUsers(
    limit?: number,
    offset?: number,
    search?: string,
    type?: string
) {
    const response = await axios.get(`${API_URL}/users`, {
        params: { limit, offset, search, type },
    });
    return response.data;
}

export async function getUserOrder(
    limit?: number,
    offset?: number,
    search?: string,
    type?: string,
    userId?: string
) {
    const response = await axios.get(`${API_URL}/orders/user/${userId}`, {
        params: { limit, offset, search, type },
    });
    return response.data;
}

export async function getUserDetail(userId: string, type?: string) {
    const response = await axios.get(`${API_URL}/user/${userId}`, {
        params: type ? { type } : {},
    });
    return response.data;
}

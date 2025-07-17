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

export async function changeUserStatus(userId: string, isActive: boolean) {
    const response = await axios.patch(`${API_URL}/user/${userId}/status`, {
        is_active: isActive,
    });
    return response.data;
}

export async function userStats(customer?: string) {
    const response = await axios.get(`${API_URL}/stats?type=${customer}`);
    return response.data;
}

export async function getUserGraph(role?: string, selectedPeriod?: string) {
    const response = await axios.get(
        `${API_URL}/user-graph?role=${role}&start_date=${selectedPeriod}`
    );
    return response;
}

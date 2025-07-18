import { API_URL } from "@/app/setting";
import axios from "./lib/axios";

/**
 * Sends a POST request to save application settings.
 *
 * @param data - The form data containing application settings to be saved.
 * @returns A promise that resolves to the response data from the server.
 */

export async function saveAppSettings(data: FormData) {
    const response = await axios.post(`${API_URL}/app-settings`, data);
    return response.data;
}

/**
 * Fetches the current application settings from the server.
 *
 * @returns A promise that resolves to an object containing the current application settings.
 */
export async function getAppSettings() {
    const response = await axios.get(`${API_URL}/app-setting`);
    return response.data;
}

/**
 * Fetches the policy content for a given type from the server.
 *
 * @param type - The type of policy to fetch, e.g., "privacy", "terms".
 * @returns A promise that resolves to an object containing the policy content.
 *          If the policy type is not found, resolves to an object with empty content.
 * @throws An error if the API call fails for reasons other than a 404 status.
 */

export async function getPolicy(type: string) {
    const response = await axios.get(`${API_URL}/policy/${type}`);
    return response.data;
}
/**
 * Saves policy information to the server.
 *
 * @param data - The form data containing policy information to be saved.
 * @returns A promise that resolves to the response data from the server.
 */
export async function savePolicy(formData: FormData) {
    const response = await axios.post(`${API_URL}/policy`, formData);
    return response.data;
}

/**
 * Fetches tickets for a given type from the server.
 *
 * @param type - The type of tickets to fetch, e.g., "open", "close".
 * @returns A promise that resolves to an object containing the tickets data.
 *          If the type is not supported, resolves to an empty array.
 * @throws An error if the API call fails.
 */
export async function getTickets(type: string) {
    const response = await axios.get(`${API_URL}/tickets/${type}`);
    return response.data;
}

export async function getTicketDetail(ticketId: string) {
    const response = await axios.get(`${API_URL}/ticket/detail/${ticketId}`);
    return response.data.data;
}
export async function replyTicket(formData: FormData) {
    const response = await axios.post(`${API_URL}/ticket/reply`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
        },
    });

    return response.data;
}

export async function getStats(period: string) {
    const response = await axios.get(`${API_URL}/stats?start_date=${period}`);
    return response.data;
}
export async function getSalesGraph(period: string) {
    const response = await axios.get(
        `${API_URL}/stats/graph?start_date=${period}`
    );
    return response;
}

export async function getRecentReview() {
    const response = await axios.get(`${API_URL}/review`);
    return response.data;
}

export async function getCategories() {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
}

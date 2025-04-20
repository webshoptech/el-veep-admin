//api file
//define the environment

import { API_URL } from "@/app/setting";

import axios from 'axios';

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
  try {
    const response = await axios.get(`${API_URL}/policy/${type}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        console.warn(`Policy for type "${type}" not found.`);
        return { content: "" }; // Return empty content instead of failing
      }

      console.error("API error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.error || "Failed to fetch policy.");
    } else {
      throw new Error("Unexpected error occurred.");
    }
  }
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

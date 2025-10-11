import axios from "../lib/axios";

export async function fetchDescription(title:string, type: string) {
    const response = await axios.post(`/generate-description`, { title, type });
    return response.data;
}
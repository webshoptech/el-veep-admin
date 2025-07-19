import axios from "../lib/axios";
import { API_URL } from "../setting";

export async function getCategories(limit?: number, offset?: number, search?: string, type?: string) {
    const response = await axios.get(`${API_URL}/categories`, {
        params: { limit, offset, type },
    });
    return response.data;
}

export async function updateCategoryStatus(categoryId: number, status: string) {
    const response = await axios.patch(`${API_URL}/category/${categoryId}/status/${status}`);
    return response.data;
}

export async function deleteCategory(categoryId: number) {
    const response = await axios.delete(`${API_URL}/category/${categoryId}`);
    return response.data;
}

export async function addCategory(formData: FormData) {
    const response = await axios.post(`${API_URL}/category`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
        },
    });

    return response.data;
}

export async function updateCategory(categoryId: number, formData: FormData) {
    const response = await axios.put(`${API_URL}/category/${categoryId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
}


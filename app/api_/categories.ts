import axios from "../lib/axios";
import { API_URL } from "../setting";

export async function getCategories(limit?: number, offset?: number, search?: string, type?: string) {
    const response = await axios.get(`${API_URL}/categories`, {
        params: { limit, offset, type, search },
    });
    return response.data;
}

export async function listSubCategories(limit?: number, offset?: number, search?: string, type?: string) {
    const response = await axios.get(`${API_URL}/subcategories`, {
        params: { limit, offset, type, search },
    });
    return response.data;
}

export async function updateCategoryStatus(categoryId: number, status: string) {
    const response = await axios.patch(`${API_URL}/category/${categoryId}/status/${status}`);
    return response.data;
}

export async function deleteCategory(categoryId: number) {
    const response = await axios.delete(`${API_URL}/category/${categoryId}/delete`);
    return response.data;
}

export async function addCategory(formData: FormData) {
    const response = await axios.post(`${API_URL}/category/create`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
        },
    });

    return response.data;
}
export async function updateCategory(categoryId: number, formData: FormData) {
    const response = await axios.post(`${API_URL}/category/${categoryId}/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
}


export async function listBanners(limit?: number, offset?: number) {
    const response = await axios.get(`${API_URL}/categories/banners`, {
        params: { limit, offset },
    });
    return response.data;
}
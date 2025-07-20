import { CategoryAnalyticsType } from "@/types/CategoryType";
import axios from "../lib/axios";
import { API_URL } from "../setting";

export async function getCategories(
    limit?: number,
    offset?: number,
    search?: string,
    type?: string
) {
    const response = await axios.get(`${API_URL}/categories`, {
        params: { limit, offset, type, search },
    });
    return response.data;
}

export async function listSubCategories(
    limit?: number,
    offset?: number,
    search?: string,
    type?: string
) {
    const response = await axios.get(`${API_URL}/subcategories`, {
        params: { limit, offset, type, search },
    });
    return response.data;
}

export async function updateCategoryStatus(categoryId: number, status: string) {
    const response = await axios.patch(
        `${API_URL}/category/${categoryId}/status/${status}`
    );
    return response.data;
}

export async function deleteCategory(categoryId: number) {
    const response = await axios.delete(
        `${API_URL}/category/${categoryId}/delete`
    );
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
    const response = await axios.post(
        `${API_URL}/category/${categoryId}/update`,
        formData,
        {
            headers: { "Content-Type": "multipart/form-data" },
        }
    );

    return response.data;
}

export async function listBanners(limit?: number, offset?: number) {
    const response = await axios.get(`${API_URL}/banners`, {
        params: { limit, offset },
    });
    return response.data;
}

export async function addBanner(formData: FormData) {
    const response = await axios.post(`${API_URL}/banners/create`, formData, {
        headers: {
            Accept: "application/json",
        },
    });
    return response.data;
}

export async function updateBanner(bannerId: number, formData: FormData) {
    const response = await axios.put(
        `${API_URL}/banners/${bannerId}/update`,
        formData,
        {
            headers: {
                Accept: "application/json",
            },
        }
    );
    return response.data;
}

export async function deleteBanner(bannerId: number) {
    const response = await axios.delete(
        `${API_URL}/banners/${bannerId}/delete`
    );
    return response.data;
}

export async function categoryAnalytics(params: {
    limit: number;
    offset: number;
}): Promise<CategoryAnalyticsType> {
    const response = await axios.get<CategoryAnalyticsType>(
        "/category-analytics",
        {
            params,
        }
    );
    return response.data;
}

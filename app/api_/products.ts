import axios from "../lib/axios";
import { API_URL } from "../setting";

export async function getRecentProducts(
    limit: number,
    offset: number,
    search?: string,
    type?: string,
    status?: string
) {
    const response = await axios.get(`${API_URL}/products`, {
        params: {
            limit,
            offset,
            ...(search ? { search } : {}),  
            ...(type ? { type } : {}),
            ...(status ? { status } : {}),
        },
    });
    return response.data;
}

export async function productGraph(selectedPeriod?: string, type?: string, status?: string) {
    const response = await axios.get(
        `${API_URL}/product-graph?start_date=${selectedPeriod}&type=${type}&status=${status}`
    );
    return response.data;
}
export async function mostSellingProducts(limit?: number, offset?: number) {
    const response = await axios.get(
        `${API_URL}/most-selling-products?limit=${limit}&offset=${offset}`
    );
    return response.data;
}
export async function mostSellingProductGraph(selectedPeriod?: string) {
    const response = await axios.get(
        `${API_URL}/most-selling-products-graph?start_date=${selectedPeriod}`
    );
    return response.data;
}
 

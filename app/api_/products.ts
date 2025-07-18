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
 

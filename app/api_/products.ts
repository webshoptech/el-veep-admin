import axios from "../lib/axios";
import { API_URL } from "../setting";

export async function getRecentProducts(
  limit: number,
  offset: number,
  search?: string,
  type?: string
) {
  const response = await axios.get(`${API_URL}/products`, {
    params: {
      limit,
      offset,
      ...(search ? { search } : {}), // only include if not empty
      ...(type ? { type } : {}),
    },
  });
  return response.data;
}

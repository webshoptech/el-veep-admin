import { ShopType } from "@/types/ShopType";
import axios from "../lib/axios";

export async function getShops(params: {
  limit: number;
  offset: number;
  type?: string;
  search?: string;
}): Promise<ShopType> {
  const response = await axios.get<ShopType>("/shops", {
    params,
  });
  return response.data;
}
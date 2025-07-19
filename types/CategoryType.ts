export interface CategoryType {
  id: number;
  name: string;
  type: "products" | "services";
  image: string | null;
  image_public_id: string | null;
  slug: string;
  description: string;
  status: "active" | "inactive";
  parent_id: number | null;
  parent_name: string | null;
  created_at: string;
  updated_at: string;
  children?: CategoryType[]; // Recursive structure for subcategories
}
export interface CategoryResponse {
  status: "success";
  data: CategoryType[];
  total: number;
  limit: number;
  offset: number;
  stats: CategoryStats;
}

export interface CategoryStats {
  total_product: number;
  total_service: number;
  total_items: number;
  total_active: number;
  total_inactive: number;
}
export interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  views: number;
  features: string;
  sales_price: string;
  regular_price: string;
  quantity: number;
  images: string[];
  image_public_ids: string[];
  status: string;
  type: string;
  shop_id: number;
  category_id: number;
  created_at: string;
  updated_at: string;
  reviews: string[];
  average_rating: number;
}

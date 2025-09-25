export interface Product {
  id: number;
  sku: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  short_description?: string;
  status: number;
  visibility: number;
  type_id: string;
  weight: number;
  custom_attributes: Array<{
    attribute_code: string;
    value: string | number | boolean;
  }>;
}

export interface Category {
  id: number;
  parent_id: number;
  name: string;
  is_active: boolean;
  position: number;
  level: number;
  product_count: number;
  children_data?: Category[];
}

export interface ProductListResponse {
  items: Product[];
  search_criteria: Record<string, unknown>;
  total_count: number;
}
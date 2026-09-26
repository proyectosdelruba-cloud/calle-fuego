export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  allergens: string[];
  is_combo_eligible: boolean;
  is_available: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  isCombo: boolean;
}

export type DeliveryMethod = "pickup" | "dine_in";
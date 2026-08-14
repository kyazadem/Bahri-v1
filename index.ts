// ============================================
// BAHRI — TypeScript Types
// ============================================

export type UserRole = 'diner' | 'staff' | 'owner';

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';

export type WaiterCallStatus = 'pending' | 'acknowledged' | 'resolved';

export type WaiterCallType = 'general' | 'bill' | 'water' | 'menu';

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  primary_color?: string;
  secondary_color?: string;
  currency?: string;
  address?: string;
  phone?: string;
  is_active: boolean;
  settings?: Record<string, unknown>;
  created_at: string;
}

export interface Profile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  restaurant_id?: string;
  phone?: string;
  created_at: string;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  available: boolean;
  sort_order: number;
  allergens?: string[];
  dietary_tags?: string[];
  created_at: string;
  extras?: MenuItemExtra[]; // joined
}

export interface MenuItemExtra {
  id: string;
  menu_item_id: string;
  name: string;
  extra_price: number;
  is_default: boolean;
  sort_order: number;
}

export interface CartExtra {
  extra_id: string;
  name: string;
  price: number;
}

export interface CartItem {
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
  extras: CartExtra[];
  image_url?: string;
  special_instructions?: string;
}

export interface Order {
  id: string;
  restaurant_id: string;
  user_id?: string;
  table_number: number;
  status: OrderStatus;
  total_amount: number;
  notes?: string;
  guest_name?: string;
  guest_phone?: string;
  created_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  selected_extras: CartExtra[];
  line_total: number;
  special_instructions?: string;
  menu_item?: MenuItem; // joined
}

export interface Favorite {
  id: string;
  user_id: string;
  menu_item_id: string;
  created_at: string;
  menu_item?: MenuItem; // joined
}

export interface WaiterCall {
  id: string;
  restaurant_id: string;
  table_number: number;
  status: WaiterCallStatus;
  call_type: WaiterCallType;
  notes?: string;
  acknowledged_by?: string;
  acknowledged_at?: string;
  created_at: string;
}

export interface TableContext {
  restaurantId: string;
  tableNumber: number;
  restaurant?: Restaurant;
}

import { CartItem } from "./cart-item.model";

export interface Order {
    userId: string;
    addressId: string;
    items: CartItem[];
    totalPrice: number;
    createdAt: Date;
  }
  
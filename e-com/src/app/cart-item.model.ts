import { Item } from "./home/items";
import { Product } from "./product.model";

export interface CartItem {
    productId: string;
    quantity: number;
    product?: Product;
}
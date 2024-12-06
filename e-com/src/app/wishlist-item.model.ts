import {Product} from "./product.model";

export interface FavoriteItem {
  productId: string;
  product?: Product
}

import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, updateDoc, arrayUnion, arrayRemove, getDoc } from '@angular/fire/firestore';
import { Product } from '../product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartsCollection = 'carts';
  private productsCollection = 'products';

  constructor(private firestore: Firestore) {}

  // Add item to cart
  async addItemToCart(userId: string, productId: string, quantity: number): Promise<void> {
    const cartDocRef = doc(this.firestore, `${this.cartsCollection}/${userId}`);
    const cartDoc = await getDoc(cartDocRef);

    if (cartDoc.exists()) {
      const cartData = cartDoc.data();
      const items = cartData['items'] || [];

      const existingItemIndex = items.findIndex((item: any) => item.productId === productId);
      if (existingItemIndex > -1) {
        // Update quantity if product exists
        items[existingItemIndex].quantity += quantity;
        await updateDoc(cartDocRef, { items });
      } else {
        // Add new product to items
        await updateDoc(cartDocRef, { items: arrayUnion({ productId, quantity }) });
      }
    } else {
      // Create a new cart if none exists
      await setDoc(cartDocRef, {
        userId,
        items: [{ productId, quantity }],
      });
    }
  }

  // Remove item from cart
  async removeItemFromCart(userId: string, productId: string): Promise<void> {
    const cartDocRef = doc(this.firestore, `${this.cartsCollection}/${userId}`);
    const cartDoc = await getDoc(cartDocRef);

    if (cartDoc.exists()) {
      const cartData = cartDoc.data();
      const updatedItems = cartData['items'].filter((item: any) => item.productId !== productId);

      await updateDoc(cartDocRef, { items: updatedItems });
    }
  }

  // Get cart for a user
  async getCart(userId: string): Promise<any> {
    const cartDocRef = doc(this.firestore, `${this.cartsCollection}/${userId}`);
    const cartDoc = await getDoc(cartDocRef);

    if (cartDoc.exists()) {
      return cartDoc.data();
    }
    return null;
  }

  async getProductById(productId: string): Promise<Product | null> {
    const productDocRef = doc(this.firestore, `${this.productsCollection}/${productId}`);
    const productDoc = await getDoc(productDocRef);

    if (productDoc.exists()) {
      return productDoc.data() as Product;
    }
    return null;
  }
}

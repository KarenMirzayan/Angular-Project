import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, updateDoc, arrayUnion, arrayRemove, getDoc } from '@angular/fire/firestore';
import { Product } from '../product.model';
import {Observable, from, forkJoin} from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import {FavoriteItem} from "../wishlist-item.model";

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private favoritesCollection = 'favorites';
  private productsCollection = 'products';

  constructor(private firestore: Firestore) {}

  // Add item to favorites
  addItemToFavorites(userId: string, productId: string): Observable<void> {
    const favoritesDocRef = doc(this.firestore, `${this.favoritesCollection}/${userId}`);

    return from(getDoc(favoritesDocRef)).pipe(
      switchMap(favoritesDoc => {
        if (favoritesDoc.exists()) {
          const favoritesData = favoritesDoc.data();
          const items = favoritesData['items'] || [];

          const existingItemIndex = items.findIndex((item: any) => item.productId === productId);
          if (existingItemIndex === -1) {
            // Add product to favorites
            items.push({ productId });
            return from(updateDoc(favoritesDocRef, { items }));
          }
          return from(Promise.resolve());
        } else {
          // Create a new favorites list if none exists
          return from(setDoc(favoritesDocRef, { userId, items: [{ productId }] }));
        }
      })
    );
  }

  // Remove item from favorites
  removeItemFromFavorites(userId: string, productId: string): Observable<void> {
    const favoritesDocRef = doc(this.firestore, `${this.favoritesCollection}/${userId}`);

    return from(getDoc(favoritesDocRef)).pipe(
      switchMap(favoritesDoc => {
        if (favoritesDoc.exists()) {
          const favoritesData = favoritesDoc.data();
          const updatedItems = favoritesData['items'].filter((item: any) => item.productId !== productId);

          return from(updateDoc(favoritesDocRef, { items: updatedItems }));
        }
        return from(Promise.resolve());
      })
    );
  }

  // Get favorites for a user
  getFavorites(userId: string): Observable<FavoriteItem[]> {
    const favoritesDocRef = doc(this.firestore, `${this.favoritesCollection}/${userId}`);

    return from(getDoc(favoritesDocRef)).pipe(
      switchMap(favoritesDoc => {
        if (favoritesDoc.exists()) {
          const favoritesData = favoritesDoc.data();
          const items = favoritesData['items'] || [];

          // Get product details for each productId in the favorites list
          const productObservables: Observable<FavoriteItem>[] = items.map((item: { productId: string }) =>
            this.getProductById(item.productId).pipe(
              map((product) => ({
                productId: item.productId,
                product: product,  // Add the product details here
              }))
            )
          );

          // Combine all product observables and return the array of FavoriteItems
          return forkJoin(productObservables);
        } else {
          return from(Promise.resolve([]));  // Return empty array if no favorites found
        }
      })
    );
  }

  // Get product details by ID
  getProductById(productId: string): Observable<Product | null> {
    const productDocRef = doc(this.firestore, `${this.productsCollection}/${productId}`);

    return from(getDoc(productDocRef)).pipe(
      map(productDoc => (productDoc.exists() ? (productDoc.data() as Product) : null))
    );
  }
}

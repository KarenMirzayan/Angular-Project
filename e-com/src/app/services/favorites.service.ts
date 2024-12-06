import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, updateDoc, arrayUnion, arrayRemove, getDoc } from '@angular/fire/firestore';
import { Product } from '../product.model';
import {forkJoin, from, map, Observable, of, switchMap} from 'rxjs';
import {FavoriteItem} from "../wishlist-item.model";

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private favoritesCollection = 'favorites';
  private productsCollection = 'products';

  constructor(private firestore: Firestore) {}

  // Add product to favorites
  addProductToFavorites(userId: string, productId: string): Observable<void> {
    const favoritesDocRef = doc(this.firestore, `${this.favoritesCollection}/${userId}`);

    return new Observable<void>((observer) => {
      getDoc(favoritesDocRef).then((favoritesDoc) => {
        if (favoritesDoc.exists()) {
          // If the document exists, update the 'items' array
          updateDoc(favoritesDocRef, { items: arrayUnion(productId) })
            .then(() => {
              observer.next();
              observer.complete();
            })
            .catch((error) => {
              observer.error(error);
            });
        } else {
          // If the document doesn't exist, create a new document with the 'items' array
          setDoc(favoritesDocRef, {
            userId,
            items: [productId],  // Initialize with the first productId
          })
            .then(() => {
              observer.next();
              observer.complete();
            })
            .catch((error) => {
              observer.error(error);
            });
        }
      }).catch((error) => {
        observer.error(error);
      });
    });
  }

  // Remove a product from favorites
  removeProductFromFavorites(userId: string, productId: string): Observable<void> {
    const favoritesDocRef = doc(this.firestore, `${this.favoritesCollection}/${userId}`);

    return new Observable<void>((observer) => {
      getDoc(favoritesDocRef).then((favoritesDoc) => {
        if (favoritesDoc.exists()) {
          // If the document exists, update the 'items' array by removing the productId
          updateDoc(favoritesDocRef, { items: arrayRemove(productId) })
            .then(() => {
              observer.next();
              observer.complete();
            })
            .catch((error) => {
              observer.error(error);
            });
        } else {
          // No operation if the document doesn't exist
          observer.next();
          observer.complete();
        }
      }).catch((error) => {
        observer.error(error);
      });
    });
  }


  // Get favorites for a user
  getFavorites(userId: string): Observable<FavoriteItem[]> {
    const favoritesDocRef = doc(this.firestore, `${this.favoritesCollection}/${userId}`);

    return from(getDoc(favoritesDocRef)).pipe(
      switchMap((favoritesDoc) => {
        if (favoritesDoc.exists()) {
          const productIds: string[] = favoritesDoc.data()['items'] || [];
          const productObservables = productIds.map((productId) => this.getProductById(productId));
          return forkJoin(productObservables).pipe(
            map((products) =>
              products.map((product, index) => ({
                productId: productIds[index],
                product: product || undefined,
              }))
            )
          );
        }
        return from([]); // Return empty array if no favorites exist
      })
    );
  }

  // Get product by ID
  getProductById(productId: string): Observable<Product | null> {
    const productDocRef = doc(this.firestore, `${this.productsCollection}/${productId}`);
    return from(
      getDoc(productDocRef).then((productDoc) =>
        productDoc.exists() ? (productDoc.data() as Product) : null
      )
    );
  }
}

import { Injectable } from '@angular/core';
import {Firestore, collection, collectionData, query, where, limit} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import {Product} from "../product.model";

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private collectionName = 'products';

  constructor(private firestore: Firestore) {}

  getProducts(): Observable<Product[]> {
    const productsCollection = collection(this.firestore, this.collectionName);
    return collectionData(productsCollection, { idField: 'id' }); // Fetch products with document ID
  }

  getByCategory(id: string): Observable<Product[]> {
    const productsCollection = collection(this.firestore, this.collectionName);
    const categoryQuery = query(productsCollection, where('categoryId', '==', id));
    return collectionData(categoryQuery, { idField: 'id' });
  }

  getFeaturedProducts(): Observable<Product[]> {
    const productsCollection = collection(this.firestore, this.collectionName);
    const first10Query = query(productsCollection, limit(10)); // Limit to the first 10 products
    return collectionData(first10Query, { idField: 'id' });
  }
}

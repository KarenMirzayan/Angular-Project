import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private collectionName = 'products';

  constructor(private firestore: Firestore) {}

  getProducts(): Observable<any[]> {
    const productsCollection = collection(this.firestore, this.collectionName);
    return collectionData(productsCollection, { idField: 'id' }); // Fetch products with document ID
  }
}

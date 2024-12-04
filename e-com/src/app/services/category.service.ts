import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

export interface Category {
  id?: string; // Firestore auto-generates document IDs
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private collectionName = 'categories';

  constructor(private firestore: Firestore) {}

  // Method to fetch all categories
  getCategories(): Observable<Category[]> {
    const categoryCollection = collection(this.firestore, 'categories'); // Reference to the 'category' collection
    return collectionData(categoryCollection, { idField: 'id' }) as Observable<Category[]>;
  }

  getCategoryById(categoryId: string): Observable<any> {
    const categoryDocRef = doc(this.firestore, `${this.collectionName}/${categoryId}`);
    return from(getDoc(categoryDocRef).then((docSnap) => (docSnap.exists() ? docSnap.data() : null)));
  }
}

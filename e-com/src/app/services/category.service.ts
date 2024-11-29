import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Category {
  id?: string; // Firestore auto-generates document IDs
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private firestore: Firestore) {}

  // Method to fetch all categories
  getCategories(): Observable<Category[]> {
    const categoryCollection = collection(this.firestore, 'categories'); // Reference to the 'category' collection
    return collectionData(categoryCollection, { idField: 'id' }) as Observable<Category[]>;
  }
}

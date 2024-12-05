import { Component } from '@angular/core';
import { Firestore, collection, getDocs, doc, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-update-products',
  standalone: true,
  template: `
    <div class="update-container">
      <h1>Update Products</h1>
      <button (click)="addIdFieldToProducts()">Add ID Field to Products</button>
      <p *ngIf="message">{{ message }}</p>
    </div>
  `,
  styles: [
    `
      .update-container {
        text-align: center;
        margin-top: 50px;
      }
      button {
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
      }
      p {
        margin-top: 20px;
        font-size: 14px;
      }
    `,
  ],
})
export class UpdateProductsComponent {
  message: string | null = null;

  constructor(private firestore: Firestore) {}

  async addIdFieldToProducts(): Promise<void> {
    const productsCollection = collection(this.firestore, 'products');

    try {
      const snapshot = await getDocs(productsCollection);

      if (snapshot.empty) {
        this.message = 'No products found in the collection.';
        return;
      }

      const updatePromises = snapshot.docs.map((docSnapshot) => {
        const productRef = doc(this.firestore, `products/${docSnapshot.id}`);
        return updateDoc(productRef, { id: docSnapshot.id }); // Add `id` field
      });

      await Promise.all(updatePromises); // Wait for all updates to complete
      this.message = 'Successfully added ID fields to all products.';
    } catch (error) {
      console.error('Error updating products:', error);
      this.message = 'Error updating products. Check console for details.';
    }
  }
}

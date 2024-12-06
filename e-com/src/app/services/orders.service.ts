import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, getDocs, Timestamp } from '@angular/fire/firestore';
import { Order } from '../order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private firestore: Firestore) {}

  // Place an order in the user's subcollection
  async placeOrder(userId: string, orderData: Omit<Order, 'createdAt'>): Promise<void> {
    const ordersCollection = collection(this.firestore, `users/${userId}/orders`);

    const orderPayload = {
      ...orderData,
      createdAt: Timestamp.now(), // Use Timestamp for Firestore
    };

    await addDoc(ordersCollection, orderPayload);
  }

  // Fetch orders for a user
  async getOrdersByUser(userId: string): Promise<Order[]> {
    const ordersCollection = collection(this.firestore, `users/${userId}/orders`);
    const querySnapshot = await getDocs(ordersCollection);

    const orders: Order[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...(data as Order), // Cast data to Order
        createdAt: (data['createdAt'] as Timestamp).toDate(), // Convert Timestamp to Date
      };
    });

    return orders;
  }
}

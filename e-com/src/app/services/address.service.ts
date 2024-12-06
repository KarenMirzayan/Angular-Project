import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, deleteDoc, doc, getDocs, setDoc } from '@angular/fire/firestore';
import { Address } from '../address.model';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor(private firestore: Firestore) {}

  // Fetch all addresses for a user
  async getAddresses(userId: string): Promise<any[]> {
    const addressesRef = collection(this.firestore, `users/${userId}/addresses`);
    const querySnapshot = await getDocs(addressesRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async addAddress(userId: string, address: Address): Promise<void> {
    const addressesRef = collection(this.firestore, `users/${userId}/addresses`);
    await addDoc(addressesRef, address);
  }

  async updateAddress(userId: string, addressId: string, address: Address): Promise<void> {
    const addressRef = doc(this.firestore, `users/${userId}/addresses/${addressId}`);
    await setDoc(addressRef, address, { merge: true });
  }

  async deleteAddress(userId: string, addressId: string): Promise<void> {
    const addressRef = doc(this.firestore, `users/${userId}/addresses/${addressId}`);
    await deleteDoc(addressRef);
  }
}

import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthSubject = new BehaviorSubject<boolean>(false); // State management for auth status
  isAuth$ = this.isAuthSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore) {}

  // Login method
  async login(email: string, password: string): Promise<void> {
    try {
      // Firebase Authentication
      const userCredential: UserCredential = await signInWithEmailAndPassword(this.auth, email, password);

      // Query Firestore for the user by email
      const usersCollection = collection(this.firestore, 'users');
      const q = query(usersCollection, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // User exists in Firestore
        this.isAuthSubject.next(true); // Set auth state to true
      } else {
        throw new Error('User not found in Firestore');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // Logout method
  logout(): void {
    this.auth.signOut();
    this.isAuthSubject.next(false); // Reset auth state
  }

  // Get auth state
  isAuthenticated(): Observable<boolean> {
    return this.isAuth$;
  }
}

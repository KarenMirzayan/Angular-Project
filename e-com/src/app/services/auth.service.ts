import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
import { Firestore, collection, query, where, getDocs, updateDoc, doc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthSubject = new BehaviorSubject<boolean>(false); // State management for auth status
  isAuth$ = this.isAuthSubject.asObservable();

  private userIdSubject = new BehaviorSubject<string | null>(null); // State management for user ID
  userId$ = this.userIdSubject.asObservable();

  private userDetailsSubject = new BehaviorSubject<{ firstName: string; lastName: string } | null>(null); // State for user details
  userDetails$ = this.userDetailsSubject.asObservable();


  private userId: string | null = null;

  constructor(private auth: Auth, private firestore: Firestore) {
    // Initialize user ID on service creation
    this.initializeUserId();
  }

  // Initialize user ID from Firebase Auth
  private async initializeUserId(): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (currentUser) {
      const email = currentUser.email;
      if (email) {
        // Query Firestore for user document by email
        const usersCollection = collection(this.firestore, 'users');
        const q = query(usersCollection, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          this.userIdSubject.next(userDoc.id); // Populate userIdSubject
          this.isAuthSubject.next(true); // Set auth state to true

          const userData = userDoc.data();
          this.userDetailsSubject.next({
            firstName: userData['firstName'],
            lastName: userData['lastName'],
          });
        }
      }
    }
  }

  // Login method
  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(this.auth, email, password);

      // Query Firestore for the user by email
      const usersCollection = collection(this.firestore, 'users');
      const q = query(usersCollection, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        this.userIdSubject.next(userDoc.id);
        this.isAuthSubject.next(true); // Set auth state to true

        const userData = userDoc.data();
        this.userDetailsSubject.next({
          firstName: userData['firstName'],
          lastName: userData['lastName'],
        });
      } else {
        throw new Error('User not found in Firestore');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  logout(): void {
    this.auth.signOut();
    this.isAuthSubject.next(false); 
    this.userIdSubject.next(null);
    this.userDetailsSubject.next(null);
  }

  // Get the current authenticated user's ID
  getUserId(): string | null {
    return this.userId;
  }
  
  isAuthenticated(): Observable<boolean> {
    return this.isAuth$;
  }

  async updateUserDetails(updatedDetails: { firstName: string; lastName: string }): Promise<void> {
    const userId = this.userIdSubject.value;
    if (!userId) {
      throw new Error('User ID not available');
    }

    const userDocRef = doc(this.firestore, `users/${userId}`);
    await updateDoc(userDocRef, updatedDetails);

    this.userDetailsSubject.next(updatedDetails);
  }
}

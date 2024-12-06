import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { AccountComponent } from './account.component';
import { AuthService } from '../services/auth.service';
import { OrderService } from '../services/orders.service';
import { Firestore } from '@angular/fire/firestore';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;

  beforeEach(async () => {
    const firestoreStub = {
      collection: (name: string) => ({
        valueChanges: () => of([]),
      }),
    };

    const authServiceStub = {
      userDetails$: of({ firstName: 'John', lastName: 'Doe' }),
      userId$: of('user123'),
    };

    const firestoreServiceStub = {}; // Add a stub for Firestore

    const activatedRouteStub = {
      snapshot: {
        paramMap: {
          get: (key: string) => 'some-id', // Mock the route parameter
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [AccountComponent], // Import the standalone component
      providers: [
        { provide: AngularFirestore, useValue: firestoreStub },
        { provide: AuthService, useValue: authServiceStub },
        { provide: Firestore, useValue: firestoreServiceStub }, // Provide the Firestore stub
        { provide: OrderService, useValue: {} }, // Provide a stub for OrdersService
        { provide: ActivatedRoute, useValue: activatedRouteStub }, // Provide the ActivatedRoute stub
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
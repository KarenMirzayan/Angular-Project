import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CheckoutComponent } from './checkout.component';
import { AddressService } from '../services/address.service';
import { AuthService } from '../services/auth.service';
import { OrderService } from '../services/orders.service';
import { CartService } from '../services/cart.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let addressServiceStub: Partial<AddressService>;
  let authServiceStub: Partial<AuthService>;
  let orderServiceStub: Partial<OrderService>;
  let cartServiceStub: Partial<CartService>;
  let routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    addressServiceStub = {
      getAddresses: jasmine.createSpy('getAddresses').and.returnValue(Promise.resolve([]))
    };

    authServiceStub = {
      userId$: of('user123')
    };

    orderServiceStub = {
      placeOrder: jasmine.createSpy('placeOrder').and.returnValue(Promise.resolve())
    };

    cartServiceStub = {
      removeItemFromCart: jasmine.createSpy('removeItemFromCart').and.returnValue(Promise.resolve())
    };

    await TestBed.configureTestingModule({
      imports: [CheckoutComponent, RouterTestingModule],
      providers: [
        { provide: AddressService, useValue: addressServiceStub },
        { provide: AuthService, useValue: authServiceStub },
        { provide: OrderService, useValue: orderServiceStub },
        { provide: CartService, useValue: cartServiceStub },
        { provide: Router, useValue: routerSpy }
      ],
    }).compileComponents();

    // Mock the history.state.selectedItems before creating the component
    spyOnProperty(history, 'state').and.returnValue({
      selectedItems: [
        { productId: 'prod1', quantity: 1, product: { id: 'prod1', categoryId: 'cat1', description: 'desc', image: 'img', name: 'Product 1', price: 100, rating: 4, reviews: 10 } }
      ]
    });

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load addresses on init', async () => {
    await component.ngOnInit();
    expect(addressServiceStub.getAddresses).toHaveBeenCalledWith('user123');
  });

  it('should calculate total price', () => {
    component.cartItems = [
      { productId: 'prod1', quantity: 1, product: { id: 'prod1', categoryId: 'cat1', description: 'desc', image: 'img', name: 'Product 1', price: 100, rating: 4, reviews: 10 } },
      { productId: 'prod2', quantity: 2, product: { id: 'prod2', categoryId: 'cat2', description: 'desc2', image: 'img2', name: 'Product 2', price: 200, rating: 5, reviews: 20 } }
    ];
    component.calculateTotalPrice();
    expect(component.totalPrice).toBe(500);
  });

  it('should confirm checkout', async () => {
    component.selectedAddressId = 'address123';
    component.userId = 'user123';
    await component.confirmCheckout();
    expect(orderServiceStub.placeOrder).toHaveBeenCalled();
    expect(cartServiceStub.removeItemFromCart).toHaveBeenCalledWith('user123', 'prod1');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/account']);
  });

  it('should not confirm checkout if no address is selected', async () => {
    spyOn(window, 'alert');
    component.selectedAddressId = null;
    await component.confirmCheckout();
    expect(window.alert).toHaveBeenCalledWith('Please select a shipping address.');
    expect(orderServiceStub.placeOrder).not.toHaveBeenCalled();
  });

  it('should not confirm checkout if user is not logged in', async () => {
    spyOn(window, 'alert');
    component.selectedAddressId = 'address123';
    component.userId = null;
    await component.confirmCheckout();
    expect(window.alert).toHaveBeenCalledWith('User not logged in!');
    expect(orderServiceStub.placeOrder).not.toHaveBeenCalled();
  });
});
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CartComponent } from './cart.component';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CartItem } from '../cart-item.model';
import { Product } from '../product.model';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartServiceStub: Partial<CartService>;
  let authServiceStub: Partial<AuthService>;
  let routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    cartServiceStub = {
      getCart: jasmine.createSpy('getCart').and.returnValue(Promise.resolve({ items: [] })),
      getProductById: jasmine.createSpy('getProductById').and.returnValue(Promise.resolve({ price: 100 } as Product)),
      addItemToCart: jasmine.createSpy('addItemToCart').and.returnValue(Promise.resolve()),
      removeItemFromCart: jasmine.createSpy('removeItemFromCart').and.returnValue(Promise.resolve())
    };

    authServiceStub = {
      userId$: of('user123')
    };

    await TestBed.configureTestingModule({
      imports: [CartComponent, RouterTestingModule],
      providers: [
        { provide: CartService, useValue: cartServiceStub },
        { provide: AuthService, useValue: authServiceStub },
        { provide: Router, useValue: routerSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cart on init', async () => {
    await component.ngOnInit();
    expect(cartServiceStub.getCart).toHaveBeenCalledWith('user123');
  });

  it('should increase quantity of a cart item', async () => {
    const cartItem: CartItem = { productId: 'prod1', quantity: 1, product: { id: 'prod1', categoryId: 'cat1', description: 'desc', image: 'img', name: 'Product 1', price: 100, rating: 4, reviews: 10 } };
    await component.increaseQuantity(cartItem);
    expect(cartServiceStub.addItemToCart).toHaveBeenCalledWith('user123', 'prod1', 1);
  });

  it('should decrease quantity of a cart item', async () => {
    const cartItem: CartItem = { productId: 'prod1', quantity: 2, product: { id: 'prod1', categoryId: 'cat1', description: 'desc', image: 'img', name: 'Product 1', price: 100, rating: 4, reviews: 10 } };
    await component.decreaseQuantity(cartItem);
    expect(cartServiceStub.addItemToCart).toHaveBeenCalledWith('user123', 'prod1', -1);
  });

  it('should remove item if quantity is 1 and decrease quantity is called', async () => {
    const cartItem: CartItem = { productId: 'prod1', quantity: 1, product: { id: 'prod1', categoryId: 'cat1', description: 'desc', image: 'img', name: 'Product 1', price: 100, rating: 4, reviews: 10 } };
    spyOn(component, 'removeItem');
    await component.decreaseQuantity(cartItem);
    expect(component.removeItem).toHaveBeenCalledWith(cartItem);
  });

  it('should remove item from cart', async () => {
    const cartItem: CartItem = { productId: 'prod1', quantity: 1, product: { id: 'prod1', categoryId: 'cat1', description: 'desc', image: 'img', name: 'Product 1', price: 100, rating: 4, reviews: 10 } };
    await component.removeItem(cartItem);
    expect(cartServiceStub.removeItemFromCart).toHaveBeenCalledWith('user123', 'prod1');
  });

  it('should calculate total price', () => {
    component.cartItems = [
      { productId: 'prod1', quantity: 1, product: { id: 'prod1', categoryId: 'cat1', description: 'desc', image: 'img', name: 'Product 1', price: 100, rating: 4, reviews: 10 } },
      { productId: 'prod2', quantity: 2, product: { id: 'prod2', categoryId: 'cat2', description: 'desc2', image: 'img2', name: 'Product 2', price: 200, rating: 5, reviews: 20 } }
    ];
    const totalPrice = component.getTotalPrice();
    expect(totalPrice).toBe(500);
  });

  it('should toggle select all items', () => {
    component.cartItems = [
      { productId: 'prod1', quantity: 1, product: { id: 'prod1', categoryId: 'cat1', description: 'desc', image: 'img', name: 'Product 1', price: 100, rating: 4, reviews: 10 } },
      { productId: 'prod2', quantity: 2, product: { id: 'prod2', categoryId: 'cat2', description: 'desc2', image: 'img2', name: 'Product 2', price: 200, rating: 5, reviews: 20 } }
    ];
    component.selectAll = true;
    component.toggleSelectAll();
    expect(component.selectedItems.every(item => item)).toBeTrue();
  });

  it('should calculate selected total price', () => {
    component.cartItems = [
      { productId: 'prod1', quantity: 1, product: { id: 'prod1', categoryId: 'cat1', description: 'desc', image: 'img', name: 'Product 1', price: 100, rating: 4, reviews: 10 } },
      { productId: 'prod2', quantity: 2, product: { id: 'prod2', categoryId: 'cat2', description: 'desc2', image: 'img2', name: 'Product 2', price: 200, rating: 5, reviews: 20 } }
    ];
    component.selectedItems = [true, false];
    const selectedTotalPrice = component.getSelectedTotalPrice();
    expect(selectedTotalPrice).toBe(100);
  });

  it('should navigate to checkout with selected items', () => {
    component.cartItems = [
      { productId: 'prod1', quantity: 1, product: { id: 'prod1', categoryId: 'cat1', description: 'desc', image: 'img', name: 'Product 1', price: 100, rating: 4, reviews: 10 } },
      { productId: 'prod2', quantity: 2, product: { id: 'prod2', categoryId: 'cat2', description: 'desc2', image: 'img2', name: 'Product 2', price: 200, rating: 5, reviews: 20 } }
    ];
    component.selectedItems = [true, false];
    component.proceedToCheckout();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/checkout'], { state: { selectedItems: [component.cartItems[0]] } });
  });
});
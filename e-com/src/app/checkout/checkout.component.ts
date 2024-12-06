import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CartItem } from '../cart-item.model';
import { Address } from '../address.model';
import { AddressService } from '../services/address.service';
import { AuthService } from '../services/auth.service';
import { OrderService } from '../services/orders.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  addresses: Address[] = [];
  selectedAddressId: string | null = null;
  userId: string | null = null;

  constructor(
    private router: Router,
    private addressService: AddressService,
    private authService: AuthService,
    private orderService: OrderService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Get selected cart items from router state
    const state = history.state;
    this.cartItems = state.selectedItems || [];
    this.calculateTotalPrice();

    // Get the user's ID
    this.authService.userId$.subscribe((id) => {
      this.userId = id;
      if (this.userId) {
        this.loadAddresses();
      }
    });
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity,
      0
    );
  }

  async loadAddresses(): Promise<void> {
    if (this.userId) {
      this.addresses = await this.addressService.getAddresses(this.userId);
      if (this.addresses.length > 0) {
        this.selectedAddressId = this.addresses[0].id || null; // Default to the first address
      }
    }
  }

  async confirmCheckout(): Promise<void> {
    if (!this.selectedAddressId) {
      alert('Please select a shipping address.');
      return;
    }
  
    if (!this.userId) {
      alert('User not logged in!');
      return;
    }
  
    const orderData = {
      userId: this.userId,
      addressId: this.selectedAddressId,
      items: this.cartItems,
      totalPrice: this.totalPrice,
    };
  
    try {
      // Place the order
      await this.orderService.placeOrder(this.userId, orderData);
  
      // Remove the checked-out items from the cart
      for (const item of this.cartItems) {
        await this.cartService.removeItemFromCart(this.userId, item.productId);
      }
  
      alert('Order placed successfully!');
      this.router.navigate(['/account']); // Redirect to orders page
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  }
  
  
}

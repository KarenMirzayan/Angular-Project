import {Component, OnInit} from '@angular/core';
import { CartItem } from '../cart-item.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit{
  cartItems: CartItem[] = [];
  selectedItems: boolean[] = [];
  selectAll: boolean = false;
  userId: string | null = null;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userIdSubscription = this.authService.userId$.subscribe((userId) => {
      this.userId = userId;
    })
    this.subscriptions.add(userIdSubscription);
    console.log(this.userId);
    if (this.userId) {
       this.loadCart();
    }
  }

  async loadCart() {

    if (this.userId) {
      try {
        const cart = await this.cartService.getCart(this.userId);
        this.cartItems = cart?.items || [];

        for (const cartItem of this.cartItems) {
          const product = await this.cartService.getProductById(cartItem.productId);
          if (product) {
            cartItem.product = product;
          }
        }
        this.selectedItems = new Array(this.cartItems.length).fill(false);
      } catch (error) {
        console.log('Error loading cart', error);
      }
    }

  }

  async increaseQuantity(cartItem: CartItem) {
    if (this.userId) {
      try {
        await this.cartService.addItemToCart(this.userId, cartItem.productId, 1);
        this.loadCart();
      } catch (error) {
        console.log('Error increasing quantity', error)
      }
    }
  }

  async decreaseQuantity(cartItem: { productId: string; quantity: number }) {
    if (!this.userId) return;

    try {
      if (cartItem.quantity > 1) {
        await this.cartService.addItemToCart(this.userId, cartItem.productId, -1);
      } else {
        this.removeItem(cartItem);
      }
      this.loadCart(); // Reload cart to update state
    } catch (error) {
      console.error('Error decreasing quantity:', error);
    }
  }

  async removeItem(cartItem: { productId: string; quantity: number }) {
    if (!this.userId) return;

    try {
      await this.cartService.removeItemFromCart(this.userId, cartItem.productId);
      this.loadCart(); // Reload cart to update state
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }

  getTotalPrice() {
    return this.cartItems.reduce(
      (total, cartItem) => total + (cartItem.product?.price || 0) * cartItem.quantity,
      0
    )
  }

  toggleSelectAll() {
    this.selectedItems.fill(this.selectAll);
  }

  getSelectedTotalPrice() {
    return this.cartItems.reduce(
      (total, cartItem, index) => {
        if (this.selectedItems[index]) {
          return total + (cartItem.product?.price || 0) * cartItem.quantity;
        }
        return total;
      }, 0
    )
  }

  getSelectedCartItems(): CartItem[] {
    return this.cartItems.filter((_, index) => this.selectedItems[index]);
  }
  
  proceedToCheckout(): void {
    const selectedItems = this.getSelectedCartItems();
    if (selectedItems.length === 0) {
      alert('Please select at least one item for checkout.');
      return;
    }
  
    // Use routing or shared service to pass selected items
    this.router.navigate(['/checkout'], { state: { selectedItems } });
  }
  
}

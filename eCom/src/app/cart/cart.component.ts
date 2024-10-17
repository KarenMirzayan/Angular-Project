import { Component } from '@angular/core';
import { CartItem } from '../cart-item.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartItems: CartItem[] = [];
  selectedItems: boolean[] = [];
  selectAll: boolean = false;
  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      console.log('Cart items:', items);
      this.cartItems = items;
      console.log(this.cartItems);
    });
  }

  increaseQuantity(cartItem: CartItem) {
    this.cartService.addToCart(cartItem.item); // Increments quantity
  }

  decreaseQuantity(cartItem: CartItem) {
    if (cartItem.quantity > 1) {
      cartItem.quantity--;
    } else {
      this.removeItem(cartItem);
    }
    this.cartService.updateCart(this.cartItems);
  }

  removeItem(cartItem: CartItem) {
    this.cartItems = this.cartItems.filter(item => item !== cartItem);
    this.cartService.updateCart(this.cartItems);
  }

  getTotalPrice() {
    return this.cartItems.reduce(
      (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
      0
    );
  }

  toggleSelectAll(event: Event) {
    this.selectedItems.fill(this.selectAll);  // Toggle all checkboxes
  }

  getSelectedTotalPrice() {
    return this.cartItems.reduce((total, cartItem, index) => {
      if (this.selectedItems[index]) {
        return total + cartItem.item.price * cartItem.quantity;
      }
      return total;
    }, 0);
  }
}

//cart.service

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from './cart-item.model';
import { Item } from './home/items';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor() { }

  addToCart(item: Item) {
    let currentCart = this.cartItems.value;
    const itemIndex = currentCart.findIndex(cartItem => cartItem.item.name === item.name);
    if (itemIndex === -1) {
      currentCart.push(
        {
          item: item, 
          quantity: 1
        });
      } else {
        currentCart[itemIndex].quantity += 1;
      }
      console.log(this.cartItems.value)
    this.cartItems.next(currentCart);
  }

  getCartItems() {
    return this.cartItems$;
  }
}

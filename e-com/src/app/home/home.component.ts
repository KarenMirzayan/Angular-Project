import { Component, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Item } from './items';
import { StarsComponent } from '../stars/stars.component';
import { CartService } from '../cart.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, StarsComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  items: Item[] = [
    new Item(
      'Pizza',
      10,
      'Food',
      'https://plus.unsplash.com/premium_photo-1679924471066-dd984e92f395?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGl6emF8ZW58MHx8MHx8fDA%3D'
    ),
    new Item(
      'T-Shirt',
      20,
      'Clothes',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2hpcnR8ZW58MHx8MHx8fDA%3D'
    ),
    new Item(
      'Laptop',
      800,
      'Electronics',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGFwdG9wfGVufDB8fDB8fHww'
    ),
    new Item(
      'Burger',
      15,
      'Food',
      'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    ),
    new Item(
      'Shoes',
      60,
      'Clothes',
      'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2hvZXN8ZW58MHx8MHx8fDA%3D'
    ),
    new Item(
      'Headphones',
      150,
      'Electronics',
      'https://plus.unsplash.com/premium_photo-1679513691474-73102089c117?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D'
    ),
    new Item(
      'Coffee',
      5,
      'Food',
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29mZmVlfGVufDB8fDB8fHww'
    ),
    new Item(
      'Watch',
      100,
      'Electronics',
      'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8d2F0Y2h8ZW58MHx8MHx8fDA%3D'
    ),
    new Item(
      'Phone',
      700,
      'Electronics',
      'https://plus.unsplash.com/premium_photo-1680985551009-05107cd2752c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHBob25lfGVufDB8fDB8fHww'
    ),
    new Item(
      'Charger',
      20,
      'Electronics',
      'https://images.unsplash.com/photo-1591290619618-904f6dd935e3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBob25lJTIwY2hhcmdlcnxlbnwwfHwwfHx8MA%3D%3D'
    ),
  ];

  constructor(private cartService: CartService) {}

  addToCart(item: Item) {
    this.cartService.addToCart(item);
  }
}

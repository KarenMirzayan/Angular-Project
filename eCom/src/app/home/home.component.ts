import {Component, OnChanges, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Item} from "./items";
import {StarsComponent} from "../stars/stars.component";
import { CartService } from '../cart.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    StarsComponent,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{
  items: Item[] = [
    new Item("Pizza", 10, "Food"), 
    new Item("T-Shirt", 20, "Clothes"), 
    new Item("Laptop", 800, "Electronics"), 
    new Item("Burger", 15, "Food"), 
    new Item("Shoes", 60, "Clothes"), 
    new Item("Headphones", 150, "Electronics"), 
    new Item("Coffee", 5, "Food"), 
    new Item("Watch", 100, "Electronics"), 
    new Item("Phone", 700, "Electronics"), 
    new Item("Charger", 20, "Electronics")
  ];
  gradients: string[] = []
  constructor(private cartService: CartService) {
    for (let i = 1; i <= 10; i++) {
      let item: Item = new Item("Name " + i);
      this.items.push(item);
      this.gradients.push(this.applyRandomGradient())
    }
  }

  addToCart(item: Item) {
    this.cartService.addToCart(item);  // Call the CartService method to add the item

  }

  getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  applyRandomGradient(): string {
    let color1 = this.getRandomColor();
    let color2 = this.getRandomColor();

    return `linear-gradient(to bottom right, ${color1}, ${color2})`;
  }
}

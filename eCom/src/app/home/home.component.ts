import {Component, OnChanges, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Item} from "./items";
import {StarsComponent} from "../stars/stars.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    StarsComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent{
  items: Item[] = [];
  gradients: string[] = []
  constructor() {
    for (let i = 1; i <= 10; i++) {
      let item: Item = new Item("Name" + i);
      this.items.push(item);
      this.gradients.push(this.applyRandomGradient())
    }
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

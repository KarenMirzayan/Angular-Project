import { Component, Input } from '@angular/core';
import {StarsComponent} from "../stars/stars.component";

@Component({
  selector: 'app-product-card',
  standalone: true,
  templateUrl: './product-card.component.html',
  imports: [
    StarsComponent
  ],
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product: any; // Accept product data as input
}

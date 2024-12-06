import { Component } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-section',
  standalone: true,
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './product-section.component.html',
  styleUrls: ['./product-section.component.css']
})
export class ProductSectionComponent {
  products = [
    
  ];

  // Pagination properties
  startIndex = 0;
  itemsPerPage = 4;

  // Getter for the visible products
  get visibleProducts() {
    return this.products.slice(this.startIndex, this.startIndex + this.itemsPerPage);
  }

  // Navigation methods
  nextPage() {
    if (this.startIndex + this.itemsPerPage < this.products.length) {
      this.startIndex += this.itemsPerPage;
    }
  }

  prevPage() {
    if (this.startIndex > 0) {
      this.startIndex -= this.itemsPerPage;
    }
  }
}

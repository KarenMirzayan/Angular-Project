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
    {
      image: '//us.laneige.com/cdn/shop/files/Product_01_9129acd1-a5ce-46e2-9d30-bbd77479f839.jpg?v=1724612072&width=672',
      name: 'Hydrating Facial Cream',
      price: 2.5,
      reviews: '45 Reviews',
      rating: 4.5,
    },
    {
      image: '//us.laneige.com/cdn/shop/files/Product_02.jpg',
      name: 'Water Bank Moisture Cream',
      reviews: '30 Reviews',
      rating: 4.7,
    },
    {
      image: '//us.laneige.com/cdn/shop/files/Product_03.jpg',
      name: 'Lip Sleeping Mask',
      reviews: '60 Reviews',
      rating: 4.8,
    },
    {
      image: '//us.laneige.com/cdn/shop/files/Product_04.jpg',
      name: 'Brightening Serum',
      reviews: '25 Reviews',
      rating: 4.6,
    },
    {
      image: '//us.laneige.com/cdn/shop/files/Product_05.jpg',
      name: 'Soothing Gel Cream',
      reviews: '18 Reviews',
      rating: 4.3,
    },
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

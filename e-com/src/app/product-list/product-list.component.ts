import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products$;

  constructor(private productService: ProductService) {
    this.products$ = this.productService.getProducts(); // Initialize in constructor
  }
  ngOnInit(): void {}
}

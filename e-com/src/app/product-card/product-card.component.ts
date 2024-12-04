import { Component, Input, OnInit } from '@angular/core';
import {StarsComponent} from "../stars/stars.component";
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  templateUrl: './product-card.component.html',
  imports: [
    StarsComponent
  ],
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  @Input() product: any; // Accept product data as input
  categoryName: string | null = null; // To store the category name

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    if (this.product?.categoryId) {
      this.categoryService.getCategoryById(this.product.categoryId).subscribe((category) => {
        this.categoryName = category ? category.name : 'Unknown Category';
      });
    }
  }

}

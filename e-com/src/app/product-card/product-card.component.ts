import { Component, Input, OnInit } from '@angular/core';
import {StarsComponent} from "../stars/stars.component";
import { CategoryService } from '../services/category.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { Product } from '../product.model';
import { Subscription } from 'rxjs';

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
  @Input() product: Product = {
    id: "",
    categoryId: "",
    description: "",
    image: "",
    name: "",
    price: 0,
    rating: 0,
    reviews: 0,
  }; // Accept product data as input
  categoryName: string | null = null; // To store the category name
  userId: string | null = null;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private categoryService: CategoryService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userIdSubscription = this.authService.userId$.subscribe((userId) => {
      this.userId = userId;
    });
    this.subscriptions.add(userIdSubscription);

    if (this.product?.categoryId) {
      this.categoryService.getCategoryById(this.product.categoryId).subscribe((category) => {
        this.categoryName = category ? category.name : 'Unknown Category';
      });
    }
  }

  async addToCart(): Promise<void> {
    console.log(this.userId);
    if (this.userId) {
      try {
        await this.cartService.addItemToCart(this.userId, this.product.id, 1);
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add to cart. Please try again later.');
      }
    }
    
  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subscriptions.unsubscribe();
  }

}

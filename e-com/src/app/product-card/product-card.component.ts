import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {StarsComponent} from "../stars/stars.component";
import { CategoryService } from '../services/category.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { Product } from '../product.model';
import { Subscription } from 'rxjs';
import {faHeart} from "@fortawesome/free-regular-svg-icons";
import {faHeart as faFilledHeart} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {CommonModule} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-product-card',
  standalone: true,
  templateUrl: './product-card.component.html',
  imports: [
    StarsComponent,
    FaIconComponent,
    CommonModule
  ],
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit, OnDestroy {
  faEmptyHeart = faHeart
  faFilledHeart = faFilledHeart

  @Input() product: Product = {
    id: "",
    categoryId: "",
    description: "",
    image: "",
    name: "",
    price: 0,
    rating: 0,
    reviews: 0,
  };
  @Input() isFavorite: boolean | null = false;
  @Output() toggleFavorite: EventEmitter<any> = new EventEmitter();
  categoryName: string | null = null; // To store the category name
  userId: string | null = null;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private categoryService: CategoryService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
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
    }else {
      this.router.navigate(['/login']).then()
    }

  }
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subscriptions.unsubscribe();
  }

  onToggleFavorite(): void {
    console.log("toggled")
    this.toggleFavorite.emit();
    this.isFavorite = !this.isFavorite;
  }

}

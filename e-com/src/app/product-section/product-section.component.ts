import {Component, OnDestroy, OnInit} from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';
import {ProductService} from "../services/product.service";
import {Product} from "../product.model";
import {catchError, Observable, of, Subscription} from "rxjs";
import {FavoriteItem} from "../wishlist-item.model";
import {AuthService} from "../services/auth.service";
import {FavoritesService} from "../services/favorites.service";
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCircleChevronLeft, faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product-section',
  standalone: true,
  imports: [ProductCardComponent, CommonModule, FaIconComponent],
  templateUrl: './product-section.component.html',
  styleUrls: ['./product-section.component.css']
})
export class ProductSectionComponent implements OnInit, OnDestroy{

  products: Product[] = [] ;
  wishlist$: Observable<FavoriteItem[]> = of([]); // Initialize as an empty observable

  userId: string = '';
  category: string = '';
  private subscriptions: Subscription = new Subscription();

  faRight = faCircleChevronRight;
  faLeft = faCircleChevronLeft;

  favoriteStatusMap: { [productId: string]: boolean } = {};
  constructor(private productService: ProductService, private authService: AuthService, private favoritesService: FavoritesService) {
    this.getFeaturedProducts()
  }

  ngOnInit() {
    const userIdSubscription = this.authService.userId$.subscribe((userId) => {
      if (userId) {
        this.userId = userId;
      }
    });
    console.log(this.userId)
    this.loadWishlist();
    this.subscriptions.add(userIdSubscription);

    this.wishlist$.subscribe((wishlist) => {
      // Map productId to isFavorite status
      this.favoriteStatusMap = wishlist.reduce((acc, item) => {
          acc[item.productId] = true;
          return acc;
        },
        {} as { [productId: string]: boolean });
    });
  }


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

  getFeaturedProducts() {
    this.productService.getFeaturedProducts().subscribe((products) => {
      this.products = products;
    })
  }

  loadWishlist(): void {
    if (this.userId) {
      this.wishlist$ = this.favoritesService.getFavorites(this.userId).pipe(
        catchError((error) => {
          console.error('Error loading wishlist:', error);
          return of([]); // Return an empty array if there's an error
        })
      );
      console.log(this.wishlist$)
    }
  }

  toggleFavorite(productId: string): void {
    const isAlreadyFavorite = this.favoriteStatusMap[productId] || false; // Check if the product is already in favorites

    if (isAlreadyFavorite) {
      // Remove from favorites
      this.favoritesService.removeItemFromFavorites(this.userId, productId).pipe(
        catchError((error) => {
          console.error('Error removing product from favorites:', error);
          return of(null);  // Return a null observable on error
        })
      ).subscribe(() => {
        // Update the status map directly
        this.favoriteStatusMap[productId] = false;
        console.log('Product removed from favorites');
      });
    } else {
      // Add to favorites
      this.favoritesService.addItemToFavorites(this.userId, productId).pipe(
        catchError((error) => {
          console.error('Error adding product to favorites:', error);
          return of(null);  // Return a null observable on error
        })
      ).subscribe(() => {
        // Update the status map directly
        this.favoriteStatusMap[productId] = true;
        console.log('Product added to favorites');
      });
    }
  }

  isFavorite(productId: string): boolean {
    return this.favoriteStatusMap[productId] || false;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}

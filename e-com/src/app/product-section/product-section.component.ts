import {Component, OnDestroy, OnInit} from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';
import {ProductService} from "../services/product.service";
import {Product} from "../product.model";
import {catchError, Observable, of, Subscription} from "rxjs";
import {FavoriteItem} from "../wishlist-item.model";
import {AuthService} from "../services/auth.service";
import {FavoritesService} from "../services/favorites.service";

@Component({
  selector: 'app-product-section',
  standalone: true,
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './product-section.component.html',
  styleUrls: ['./product-section.component.css']
})
export class ProductSectionComponent implements OnInit, OnDestroy{

  products: Product[] = [] ;
  wishlist$: Observable<FavoriteItem[]> = of([]); // Initialize as an empty observable

  userId: string = '';
  category: string = '';
  private subscriptions: Subscription = new Subscription();

  favoriteStatusMap: { [productId: string]: boolean } = {};
  constructor(private productService: ProductService, private authService: AuthService, private favoritesService: FavoritesService) {
    this.getFeaturedProducts()
  }

  ngOnInit() {
    const userIdSubscription = this.authService.userId$.subscribe((userId) => {
      if (userId) {
        this.userId = userId;
        this.loadWishlist(); // Load wishlist as soon as userId is available
      }
    });
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
    }
  }

  toggleFavorite(productId: string): void {
    this.wishlist$.subscribe((wishlist) => {
      const existingFavorite = wishlist.find((item) => item.productId === productId);

      if (existingFavorite) {
        this.favoritesService.removeItemFromFavorites(this.userId, productId).pipe(
          catchError((error) => {
            console.error('Error removing product from favorites:', error);
            return of(null);
          })
        ).subscribe(() => {
          this.wishlist$ = this.favoritesService.getFavorites(this.userId);
          console.log(wishlist)// Refresh wishlist after removal
        });
      } else {
        this.favoritesService.getProductById(productId).subscribe((product) => {
          if (product) {
            this.favoritesService.addItemToFavorites(this.userId, productId).pipe(
              catchError((error) => {
                console.error('Error adding product to favorites:', error);
                return of(null);
              })
            ).subscribe(() => {
              this.wishlist$ = this.favoritesService.getFavorites(this.userId);
              console.log(wishlist)// Refresh wishlist after adding
            });
          }
        });
      }
    });
  }

  isFavorite(productId: string): boolean {
    return this.favoriteStatusMap[productId] || false;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}

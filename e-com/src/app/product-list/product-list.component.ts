import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductService} from '../services/product.service';
import {ProductCardComponent} from '../product-card/product-card.component';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from "@angular/router";
import {catchError, Observable, of, Subscription} from "rxjs";
import {CategoryService} from "../services/category.service";
import {FavoritesService} from "../services/favorites.service";
import {AuthService} from "../services/auth.service";
import {FavoriteItem} from "../wishlist-item.model";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  products$: Observable<any[]> | undefined;
  wishlist$: Observable<FavoriteItem[]> = of([]); // Initialize as an empty observable

  userId: string = '';
  category: string = '';
  private subscriptions: Subscription = new Subscription();

  favoriteStatusMap: { [productId: string]: boolean } = {};

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    // Handle userId loading
    const userIdSubscription = this.authService.userId$.subscribe((userId) => {
      if (userId) {
        this.userId = userId;
        this.loadWishlist(); // Load wishlist as soon as userId is available
      }
    });
    this.subscriptions.add(userIdSubscription);

    // Load products
    let id = this.route.snapshot.params['id'];
    if (id === undefined) {
      this.getAllProducts();
      this.category = "All Products";
    } else {
      this.getCategory(id);
    }

    this.wishlist$.subscribe((wishlist) => {
      // Map productId to isFavorite status
      this.favoriteStatusMap = wishlist.reduce((acc, item) => {
          acc[item.productId] = true;
          return acc;
        },
        {} as { [productId: string]: boolean });
    });
  }

  getAllProducts(): void {
    this.products$ = this.productService.getProducts();
  }

  getCategory(id: string): void {
    this.products$ = this.productService.getByCategory(id);
    this.categoryService.getCategoryById(id).subscribe((category) => {
      this.category = category.name;
    });
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
          this.wishlist$ = this.favoritesService.getFavorites(this.userId); // Refresh wishlist after removal
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
              this.wishlist$ = this.favoritesService.getFavorites(this.userId); // Refresh wishlist after adding
            });
          }
        });
      }
    });
  }

  isFavorite(productId: string): boolean {
    return this.favoriteStatusMap[productId] || false;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

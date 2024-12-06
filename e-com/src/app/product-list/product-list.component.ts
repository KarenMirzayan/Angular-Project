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
        console.log(userId)
      }
    });
    console.log(this.userId)
    console.log("aaa")
    this.loadWishlist();
    this.subscriptions.add(userIdSubscription);

    // Load products
    let id = this.route.snapshot.params['id'];
    if (id === undefined) {
      this.getAllProducts();
      this.category = "All Products";
    } else {
      this.getCategory(id);
    }
    console.log("aaa4")

    this.wishlist$.subscribe((wishlist) => {
      // Map productId to isFavorite status
      this.favoriteStatusMap = wishlist.reduce((acc, item) => {
          acc[item.productId] = true;
          return acc;
        },
        {} as { [productId: string]: boolean });
    });
    console.log(this.favoriteStatusMap)
    console.log("aaa3")
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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

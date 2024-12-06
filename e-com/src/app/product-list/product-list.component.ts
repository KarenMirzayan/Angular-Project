  import { Component, OnInit } from '@angular/core';
  import { ProductService } from '../services/product.service';
  import { ProductCardComponent } from '../product-card/product-card.component';
  import { CommonModule } from '@angular/common';
  import {ActivatedRoute} from "@angular/router";
  import {catchError, Observable, of} from "rxjs";
  import {CategoryService} from "../services/category.service";
  import {FavoritesService} from "../services/favorites.service";
  import {AuthService} from "../services/auth.service";
  import {FavoriteItem} from "../wishlist-item.model";

  @Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, ProductCardComponent],
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css'],
  })
  export class ProductListComponent implements OnInit {
    products$: Observable<any[]> | undefined;
    wishlist: FavoriteItem[] = []

    id: string = '';

    userId: string = '';

    category: string = '';

    constructor(private productService: ProductService,
                private categoryService: CategoryService,
                private route: ActivatedRoute,
                private favoritesService: FavoritesService,
                private authService: AuthService) {}

    ngOnInit(): void {
      let id = this.route.snapshot.params['id'];
      if (id === undefined) {
        this.getAllProducts()
        this.category = "All Products"
      }
      else {
        this.getCategory(id)
      }

      this.userId = this.authService.getUserId();
      if (this.userId) {
        this.loadWishlist()
      }
    }

    getAllProducts() {
      this.products$ = this.productService.getProducts();
    }

    getCategory(id: string) {
      this.products$ = this.productService.getByCategory(id);
      this.categoryService.getCategoryById(id).subscribe(category => {
        this.category = category.name
      })
    }

    loadWishlist() {
      if (this.userId) {
        try {
          let wishlist: FavoriteItem[] | null = []
          this.favoritesService.getFavorites(this.userId).subscribe((favorites) => {
            wishlist = favorites;
          })
          this.wishlist = wishlist;
        }
        catch (error) {
          console.error(error);
        }
      }
    }

    toggleFavorite(productId: string) {
      let existingFavorite = this.wishlist.find(item => item.productId === productId);
      if (existingFavorite) {
        this.favoritesService.removeProductFromFavorites(this.userId, productId).subscribe(() => {
          this.wishlist = this.wishlist.filter(item => item.productId !== productId);
        });
      } else {
        let product;
        this.favoritesService.getProductById(productId).subscribe((prod) => {
          if (prod) {
            product = prod;
          }
        })
        let favoriteItem: FavoriteItem = {
          productId: productId,
          product: product
        }
        this.favoritesService.addProductToFavorites(this.userId, productId).pipe(
          catchError((error) => {
            console.error('Error adding product to favorites:', error);
            return of(null);
          })
        ).subscribe({
          next: () => {
            console.log('Product added to favorites successfully');
            this.wishlist.push(favoriteItem)
          },
          error: (err) => {
            console.error('Unexpected error:', err);
          },
          complete: () => {
            console.log('Observable completed');
          }
        });
      }
    }

    isFavorite(productId: string) {
       return this.wishlist.some((item) => {
         return item.productId = productId;
       })
    }
  }

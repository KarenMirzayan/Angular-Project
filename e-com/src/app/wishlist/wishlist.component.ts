import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FavoritesService} from "../services/favorites.service";
import {AuthService} from "../services/auth.service";
import {catchError, of, Subscription} from "rxjs";
import {FavoriteItem} from "../wishlist-item.model";
import {CommonModule} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit, OnDestroy {

  isLoaded = false;
  wishlist: FavoriteItem[] = [];
  private subscriptions: Subscription = new Subscription();
  userId:string = '';

  constructor(private favoritesService: FavoritesService,
              private authService: AuthService,
              private cdr: ChangeDetectorRef,
              private router: Router) {

  }

  ngOnInit() {
    const userIdSubscription = this.authService.userId$.subscribe((userId) => {
      if (userId) {
        this.userId = userId;
      }
    })
    this.subscriptions.add(userIdSubscription);
    this.loadWishlist();
    console.log(this.userId);
    if (!this.userId) {
      console.error("UserId is empty")
    }
  }

  loadWishlist() {
    if (this.userId) {
      try {
        const wishlistSubscription = this.favoritesService.getFavorites(this.userId).subscribe((favorites) => {
          this.wishlist = favorites; // Assign to `this.wishlist` here
          this.isLoaded = true;
          console.log(favorites);
        });
        this.subscriptions.add(wishlistSubscription);
      } catch (error) {
        console.error(error);
      }
    }
  }


  removeFromWishlist(productId: string) {
    this.favoritesService.removeItemFromFavorites(this.userId, productId).subscribe(() => {
      this.wishlist = this.wishlist.filter((item) => item.productId !== productId);
    })
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}

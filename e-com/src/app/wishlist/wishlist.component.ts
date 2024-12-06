import { Component } from '@angular/core';
import {FavoritesService} from "../services/favorites.service";
import {AuthService} from "../services/auth.service";
import {Subscription} from "rxjs";
import {FavoriteItem} from "../wishlist-item.model";

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {

  wishlist: FavoriteItem[] = [];
  private subscriptions: Subscription = new Subscription();
  userId:string = '';

  constructor(private favoritesService: FavoritesService,
              private authService: AuthService,) {
    const userIdSubscription = this.authService.userId$.subscribe((userId) => {
      if (userId) {
        this.userId = userId;
      }
    })
    this.subscriptions.add(userIdSubscription);
    console.log(this.userId);
    if (this.userId) {
      this.loadWishlist();
      console.log(this.wishlist)
      console.log("aaa")
    }
    else {
      console.error("UserId is empty")
    }
  }

  loadWishlist() {
    if (this.userId) {
      try {
        let wishlist: FavoriteItem[] | null = []
        this.favoritesService.getFavorites(this.userId).subscribe((favorites) => {
          wishlist = favorites;
          console.log(favorites);
        })
        this.wishlist = wishlist;
        console.log("aaa")
      }
      catch (error) {
        console.error(error);
      }
    }
  }
}

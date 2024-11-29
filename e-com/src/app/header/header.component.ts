import { Component } from '@angular/core';
import {NgClass, NgOptimizedImage} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {faBarsStaggered, faMagnifyingGlass, faShoppingCart} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faUserCircle} from "@fortawesome/free-regular-svg-icons";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgClass,
    NgOptimizedImage,
    FormsModule,
    RouterLink,
    FaIconComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isOpen = false;
  faCart = faShoppingCart;
  faUser = faUserCircle
  faBars = faBarsStaggered;
  faSearch = faMagnifyingGlass

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  isSearching = false;

  openSearch() {
    this.isSearching = !this.isSearching;
  }
}

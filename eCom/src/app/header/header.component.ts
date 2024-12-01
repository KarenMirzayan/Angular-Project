import {Component, HostListener} from '@angular/core';
import {CommonModule, NgClass, NgOptimizedImage} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {faBarsStaggered, faMagnifyingGlass, faShoppingCart} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faUserCircle} from "@fortawesome/free-regular-svg-icons";
import {Category} from "../../categories.model";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgClass,
    NgOptimizedImage,
    FormsModule,
    RouterLink,
    FaIconComponent,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isOpen = false;
  faCart = faShoppingCart;
  faUser = faUserCircle
  faBars = faBarsStaggered;
  faSearch = faMagnifyingGlass;

  isDropdownOpen=false;
  categories:Category[] = [
    {
      id: 1,
      name: 'Food'
    },
    {
      id: 2,
      name: 'Clothes'
    }
  ]

  isSearching = false;

  isHidden= false;
  private lastScrollTop=0;

  @HostListener('window:scroll', [])
    onWindowScroll() {
    const currentScroll = window.scrollY || document.documentElement.scrollTop;

    if (currentScroll <= 66) {
      // Always show the header when near the top
      this.isHidden = false;
      this.lastScrollTop = currentScroll; // Reset last scroll position
      return;
    }

    if (Math.abs(currentScroll - this.lastScrollTop) > 30) {
      if (currentScroll > this.lastScrollTop) {
        // Scrolling down
        this.isHidden = true;
      } else {
        // Scrolling up
        this.isHidden = false;
      }
      this.lastScrollTop = currentScroll; // Update last scroll position
    }
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      document.body.classList.add('noscroll')
    } else {
      document.body.classList.remove('noscroll');
    }
  }

  openSearch() {
    this.isSearching = !this.isSearching;
  }

  toggleDropdown(event: Event) {
    event.preventDefault()
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}

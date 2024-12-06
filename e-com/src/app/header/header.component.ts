import {Component, HostListener, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {faHeart, faBarsStaggered, faMagnifyingGlass, faShoppingCart} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faUserCircle} from "@fortawesome/free-regular-svg-icons";
import {Category, CategoryService} from "../services/category.service";
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgOptimizedImage,
    FormsModule,
    RouterLink,
    FaIconComponent,
    CommonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isOpen = false;
  isAuth = false;
  faCart = faShoppingCart;
  faUser = faUserCircle
  faBars = faBarsStaggered;
  faSearch = faMagnifyingGlass;
  faWishlist = faHeart

  isCatalogOpen = false;

  isSearching = false;

  isHidden= false;
  private lastScrollTop=0;

  categories: Category[] = []

  constructor(
    private catService: CategoryService,
    private authService: AuthService,
    private router: Router
  ) {
    this.getCategories()
  }

  ngOnInit(): void {
      this.authService.isAuth$.subscribe((authStatus) => {
        this.isAuth = authStatus;
      })
  }

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
        this.isCatalogOpen = false;
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

  toggleCatalog(state: boolean) {
    this.isCatalogOpen = state;
  }

  getCategories() {
    this.catService.getCategories().subscribe((list) => {
      this.categories = list;
    })
  }

  navigateUser() {
    if (this.isAuth) {
      this.router.navigate(['/account']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}

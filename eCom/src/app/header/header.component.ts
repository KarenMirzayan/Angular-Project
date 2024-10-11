import { Component } from '@angular/core';
import {NgClass, NgOptimizedImage} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgClass,
    NgOptimizedImage,
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isOpen = false;

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  isSearching = false;

  openSearch() {
    this.isSearching = !this.isSearching;
  }
}

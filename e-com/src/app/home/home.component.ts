import { Component, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Item } from './items';
import { StarsComponent } from '../stars/stars.component';
import { CartService } from '../services/cart.service';
import { RouterModule } from '@angular/router';
import {ProductSectionComponent} from "../product-section/product-section.component";
import {PromoGalleryComponent} from "../promo-gallery/promo-gallery.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, StarsComponent, RouterModule, ProductSectionComponent, PromoGalleryComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

}

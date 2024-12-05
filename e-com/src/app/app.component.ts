import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from "./header/header.component";
import {FooterComponent} from "./footer/footer.component";
import { CartComponent } from './cart/cart.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductSectionComponent } from './product-section/product-section.component';
import {SwUpdate, VersionReadyEvent} from "@angular/service-worker";
import {MatSnackBar} from "@angular/material/snack-bar";
import {filter} from "rxjs";
import { AddIdsComponent } from './add-ids/add-ids.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    CartComponent,
    CategoryListComponent,
    ProductSectionComponent,
    AddIdsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'eCom';

  constructor(swUpdate: SwUpdate, snackbar: MatSnackBar) {
    swUpdate.versionUpdates.pipe(
      filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY')
    ).subscribe( event => {
      const snack = snackbar.open('New version ready', 'Reload');
      snack.onAction().subscribe(() => {
        swUpdate.activateUpdate().then(() => window.location.reload());
      });
    });
  }
}

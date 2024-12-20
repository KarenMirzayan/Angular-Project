import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from "./header/header.component";
import {FooterComponent} from "./footer/footer.component";
import { ProductSectionComponent } from './product-section/product-section.component';
import {SwUpdate, VersionReadyEvent} from "@angular/service-worker";
import {MatSnackBar} from "@angular/material/snack-bar";
import {filter} from "rxjs";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
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

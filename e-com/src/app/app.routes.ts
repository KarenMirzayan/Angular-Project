import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import { CartComponent } from './cart/cart.component';
import {LoginComponent} from "./login/login.component";
import { ProductListComponent } from './product-list/product-list.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'all-products', component: ProductListComponent},
  { path: 'categories/:id', component: ProductListComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

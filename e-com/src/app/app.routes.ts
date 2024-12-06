import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import { CartComponent } from './cart/cart.component';
import {LoginComponent} from "./login/login.component";
import { ProductListComponent } from './product-list/product-list.component';
import { AccountComponent } from './account/account.component';
import { AddressesComponent } from './addresses/addresses.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'account', component: AccountComponent},
  { path: 'account/addresses', component: AddressesComponent },
  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'all-products', component: ProductListComponent},
  { path: 'categories/:id', component: ProductListComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },

];

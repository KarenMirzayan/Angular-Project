import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { OrderService } from '../services/orders.service';
import { Order } from '../order.model';
import { CommonModule } from '@angular/common';
import { EditPopupComponent } from '../edit-popup/edit-popup.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    EditPopupComponent,
    RouterLink
  ],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  firstName: string = "";
  lastName: string = "";
  isPopupVisible: boolean = false;
  orders: Order[] = [];
  userId: string | null = null;

  constructor(
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    // Fetch user details
    this.authService.userDetails$.subscribe((personalDetails) => {
      if (personalDetails) {
        this.firstName = personalDetails.firstName;
        this.lastName = personalDetails.lastName;
      }
    });

    // Fetch user ID and orders
    this.authService.userId$.subscribe((id) => {
      this.userId = id;
      if (this.userId) {
        this.loadOrders();
      }
    });
  }

  async loadOrders(): Promise<void> {
    if (this.userId) {
      this.orders = await this.orderService.getOrdersByUser(this.userId);
    }
  }

  openEditPopup(): void {
    this.isPopupVisible = true;
  }

  closeEditPopup(): void {
    this.isPopupVisible = false;
  }

  async updatePersonalDetails(updatedDetails: { firstName: string, lastName: string }): Promise<void> {
    this.firstName = updatedDetails.firstName;
    this.lastName = updatedDetails.lastName;

    try {
      await this.authService.updateUserDetails(updatedDetails);
    } catch (error) {
      console.error('Failed to update personal details:', error);
    }
  }
}

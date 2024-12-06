import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Address } from '../address.model';
import { AddressService } from '../services/address.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AddAddressPopupComponent } from '../add-address-popup/add-address-popup.component';

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    AddAddressPopupComponent
  ],
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.css']
})
export class AddressesComponent implements OnInit {
  userId: string | null = null;
  addresses: Address[] = [];
  isPopupVisible: boolean = false;
  editingAddress: Address | null = null;


  constructor(private addressService: AddressService, private authService: AuthService) {}

  ngOnInit(): void {
    // Get the logged-in user's ID
    this.authService.userId$.subscribe((id) => {
      this.userId = id;
      if (this.userId) {
        this.loadAddresses();
      }
    });
  }

  async loadAddresses(): Promise<void> {
    if (this.userId) {
      this.addresses = await this.addressService.getAddresses(this.userId);
    }
  }

  openAddAddressPopup(): void {
    this.editingAddress = null;
    this.isPopupVisible = true;
  }

  openEditAddressPopup(address: Address): void {
    this.editingAddress = { ...address }; 
    this.isPopupVisible = true;
  }

  closePopup(): void {
    this.isPopupVisible = false;
    this.editingAddress = null;
  }

  async saveAddress(addressData: Address): Promise<void> {
    if (this.userId) {
      if (this.editingAddress) {
        // Update existing address
        await this.addressService.updateAddress(this.userId, this.editingAddress.id!, addressData);
      } else {
        // Add new address
        await this.addressService.addAddress(this.userId, addressData);
      }

      this.isPopupVisible = false;
      this.loadAddresses(); // Refresh the addresses list
    }
  }

  async deleteAddress(addressId: string): Promise<void> {
    if (this.userId) {
      try {
        await this.addressService.deleteAddress(this.userId, addressId);
        this.loadAddresses(); // Refresh the addresses list
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
  }
}

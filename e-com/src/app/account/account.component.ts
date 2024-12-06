import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { EditPopupComponent } from '../edit-popup/edit-popup.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    EditPopupComponent
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  firstName: string = "";
  lastName: string = "";
  isPopupVisible: boolean = false;

  constructor (
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.userDetails$.subscribe((personalDetails) => {
      if (personalDetails) {
        this.firstName = personalDetails.firstName;
        this.lastName = personalDetails.lastName;
      }
    })
  }

  openEditPopup(): void {
    this.isPopupVisible = true;
  }

  closeEditPopup(): void {
    this.isPopupVisible = false;
  }

  updatePersonalDetails(
    updatedDetails: {
      firstName: string,
      lastName:string
    }): void {
      this.firstName = updatedDetails.firstName;
      this.lastName = updatedDetails.lastName;
    }

}

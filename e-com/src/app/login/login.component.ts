import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    CommonModule,         // Provides *ngIf, *ngFor, etc.
    ReactiveFormsModule,  // Provides [formGroup] and form controls
    RouterModule          // Provides [routerLink]
  ],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup; // Reactive form for login
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    // Initialize the form with validation
    this.loginForm = this.fb.group({
      email: [
        '', 
        [Validators.required, Validators.email] // Email must be valid
      ],
      password: [
        '', 
        [Validators.required, Validators.minLength(6)] // Password must be at least 6 characters
      ],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      // Mark all controls as touched to trigger validation messages
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    try {
      await this.authService.login(email, password);
      this.errorMessage = null; // Clear any previous errors
      console.log('Login successful');
    } catch (error: any) {
      this.errorMessage = error.message; // Display error to the user
    }
  }
}

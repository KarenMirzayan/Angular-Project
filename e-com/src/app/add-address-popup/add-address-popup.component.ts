import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Address } from '../address.model';

@Component({
  selector: 'app-add-address-popup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-address-popup.component.html',
  styleUrls: ['./add-address-popup.component.css']
})
export class AddAddressPopupComponent implements OnInit{
  @Input() address: Address | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ address: string; city: string; zipCode: string }>();

  addressForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addressForm = this.fb.group({
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (this.address) {
      this.addressForm.patchValue(this.address); // Prefill form for editing
    }
  }

  saveAddress(): void {
    if (this.addressForm.valid) {
      this.save.emit(this.addressForm.value);
    }
  }

  closePopup(): void {
    this.close.emit();
  }
}

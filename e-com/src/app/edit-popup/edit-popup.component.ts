import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-popup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './edit-popup.component.html',
  styleUrls: ['./edit-popup.component.css'],
})
export class EditPopupComponent {
  @Input() firstName: string = '';
  @Input() lastName: string = '';
  @Output() close = new EventEmitter<void>();
  @Output() update = new EventEmitter<{ firstName: string; lastName: string }>();

  editForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.editForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.editForm.patchValue({
      firstName: this.firstName,
      lastName: this.lastName,
    });
  }

  saveChanges(): void {
    if (this.editForm.valid) {
      this.update.emit(this.editForm.value);
    }
    this.closePopup();
  }

  closePopup(): void {
    this.close.emit();
  }
}

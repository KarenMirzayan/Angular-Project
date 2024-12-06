import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddAddressPopupComponent } from './add-address-popup.component';
import { AddressService } from '../services/address.service';
import { of } from 'rxjs';

describe('AddAddressPopupComponent', () => {
  let component: AddAddressPopupComponent;
  let fixture: ComponentFixture<AddAddressPopupComponent>;
  let addressServiceStub: Partial<AddressService>;

  beforeEach(async () => {
    addressServiceStub = {
      addAddress: jasmine.createSpy('addAddress').and.returnValue(of(true))
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AddAddressPopupComponent], // Import the standalone component
      providers: [
        { provide: AddressService, useValue: addressServiceStub },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddAddressPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.addressForm).toBeDefined();
    expect(component.addressForm.controls['address']).toBeDefined();
    expect(component.addressForm.controls['city']).toBeDefined();
    expect(component.addressForm.controls['zipCode']).toBeDefined();
  });

  it('should emit save event on submit', () => {
    spyOn(component.save, 'emit');
    component.addressForm.setValue({
      address: '123 Main St',
      city: 'Anytown',
      zipCode: '12345'
    });
    component.saveAddress();
    expect(component.save.emit).toHaveBeenCalledWith({
      address: '123 Main St',
      city: 'Anytown',
      zipCode: '12345'
    });
  });

  it('should not emit save event if form is invalid', () => {
    spyOn(component.save, 'emit');
    component.addressForm.setValue({
      address: '',
      city: '',
      zipCode: ''
    });
    component.saveAddress();
    expect(component.save.emit).not.toHaveBeenCalled();
  });
});
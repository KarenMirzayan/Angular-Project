import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';
import { AddressesComponent } from './addresses.component';
import { AuthService } from '../services/auth.service';
import { AddressService } from '../services/address.service';
import { Address } from '../address.model';
import { ActivatedRoute } from '@angular/router';

describe('AddressesComponent', () => {
  let component: AddressesComponent;
  let fixture: ComponentFixture<AddressesComponent>;
  let authServiceStub: Partial<AuthService>;
  let addressServiceStub: Partial<AddressService>;

  beforeEach(async () => {
    const firestoreStub = {
      collection: (name: string) => ({
        valueChanges: () => of([]),
      }),
    };

    authServiceStub = {
      userId$: of('user123')
    };

    addressServiceStub = {
      getAddresses: jasmine.createSpy('getAddresses').and.returnValue(Promise.resolve([])),
      addAddress: jasmine.createSpy('addAddress').and.returnValue(Promise.resolve()),
      updateAddress: jasmine.createSpy('updateAddress').and.returnValue(Promise.resolve()),
      deleteAddress: jasmine.createSpy('deleteAddress').and.returnValue(Promise.resolve())
    };

    const activatedRouteStub = {
      snapshot: {
        paramMap: {
          get: (key: string) => 'some-id', // Mock the route parameter
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [AddressesComponent], // Import the standalone component
      providers: [
        { provide: AngularFirestore, useValue: firestoreStub },
        { provide: AuthService, useValue: authServiceStub },
        { provide: AddressService, useValue: addressServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub } // Provide the ActivatedRoute stub
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load addresses on init', async () => {
    await component.ngOnInit();
    expect(addressServiceStub.getAddresses).toHaveBeenCalledWith('user123');
  });

  it('should open add address popup', () => {
    component.openAddAddressPopup();
    expect(component.isPopupVisible).toBeTrue();
    expect(component.editingAddress).toBeNull();
  });

  it('should open edit address popup', () => {
    const address: Address = { address: '123 Main St', city: 'Anytown', zipCode: '12345' };
    component.openEditAddressPopup(address);
    expect(component.isPopupVisible).toBeTrue();
    expect(component.editingAddress).toEqual(address);
  });

  it('should close popup', () => {
    component.closePopup();
    expect(component.isPopupVisible).toBeFalse();
    expect(component.editingAddress).toBeNull();
  });

  it('should save new address', async () => {
    const addressData: Address = { address: '123 Main St', city: 'Anytown', zipCode: '12345' };
    component.editingAddress = null;
    await component.saveAddress(addressData);
    expect(addressServiceStub.addAddress).toHaveBeenCalledWith('user123', addressData);
    expect(component.isPopupVisible).toBeFalse();
  });

  it('should update existing address', async () => {
    const addressData: Address = { address: '123 Main St', city: 'Anytown', zipCode: '12345' };
    component.editingAddress = { id: 'address123', address: 'Old Address', city: 'Old City', zipCode: '00000' };
    await component.saveAddress(addressData);
    expect(addressServiceStub.updateAddress).toHaveBeenCalledWith('user123', 'address123', addressData);
    expect(component.isPopupVisible).toBeFalse();
  });

  it('should delete address', async () => {
    await component.deleteAddress('address123');
    expect(addressServiceStub.deleteAddress).toHaveBeenCalledWith('user123', 'address123');
  });
});
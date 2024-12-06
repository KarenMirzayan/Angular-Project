import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAddressPopupComponent } from './add-address-popup.component';

describe('AddAddressPopupComponent', () => {
  let component: AddAddressPopupComponent;
  let fixture: ComponentFixture<AddAddressPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAddressPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAddressPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

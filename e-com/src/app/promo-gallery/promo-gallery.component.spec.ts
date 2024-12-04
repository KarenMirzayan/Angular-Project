import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoGalleryComponent } from './promo-gallery.component';

describe('PromoGalleryComponent', () => {
  let component: PromoGalleryComponent;
  let fixture: ComponentFixture<PromoGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoGalleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromoGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

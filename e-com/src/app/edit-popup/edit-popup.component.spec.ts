import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPopupComponent } from './edit-popup.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('EditPopupComponent', () => {
  let component: EditPopupComponent;
  let fixture: ComponentFixture<EditPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, EditPopupComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with input values', () => {
    component.firstName = 'John';
    component.lastName = 'Doe';
    component.ngOnInit();
    expect(component.editForm.value).toEqual({ firstName: 'John', lastName: 'Doe' });
  });

  it('should emit update event with form values on saveChanges', () => {
    spyOn(component.update, 'emit');
    component.editForm.setValue({ firstName: 'John', lastName: 'Doe' });
    component.saveChanges();
    expect(component.update.emit).toHaveBeenCalledWith({ firstName: 'John', lastName: 'Doe' });
  });

  it('should not emit update event if form is invalid', () => {
    spyOn(component.update, 'emit');
    component.editForm.setValue({ firstName: '', lastName: '' });
    component.saveChanges();
    expect(component.update.emit).not.toHaveBeenCalled();
  });

  it('should emit close event on closePopup', () => {
    spyOn(component.close, 'emit');
    component.closePopup();
    expect(component.close.emit).toHaveBeenCalled();
  });
});
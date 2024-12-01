import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCreditLimitPopupComponent } from './edit-credit-limit-popup.component';

describe('EditCreditLimitPopupComponent', () => {
  let component: EditCreditLimitPopupComponent;
  let fixture: ComponentFixture<EditCreditLimitPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCreditLimitPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCreditLimitPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

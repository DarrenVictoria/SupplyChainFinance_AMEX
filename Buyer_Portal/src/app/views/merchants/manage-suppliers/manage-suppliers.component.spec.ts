import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInvoiceComponent } from './manage-suppliers.component';

describe('AddInvoiceComponent', () => {
  let component: AddInvoiceComponent;
  let fixture: ComponentFixture<AddInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddInvoiceComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

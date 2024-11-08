import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerGridComponent } from './buyer-grid.component';

describe('BuyerGridComponent', () => {
  let component: BuyerGridComponent;
  let fixture: ComponentFixture<BuyerGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyerGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyerGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

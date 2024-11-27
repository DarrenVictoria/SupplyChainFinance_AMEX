import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBuyersComponent } from './my-buyers.component';

describe('MyBuyersComponent', () => {
  let component: MyBuyersComponent;
  let fixture: ComponentFixture<MyBuyersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyBuyersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyBuyersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

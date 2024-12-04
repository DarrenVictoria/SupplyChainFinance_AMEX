import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeProductsComponent } from './programs.component';

describe('TypeProductsComponent', () => {
  let component: TypeProductsComponent;
  let fixture: ComponentFixture<TypeProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeProductsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TypeProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

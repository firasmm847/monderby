import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingSuccessComponent } from './pricing-success.component';

describe('PricingSuccessComponent', () => {
  let component: PricingSuccessComponent;
  let fixture: ComponentFixture<PricingSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricingSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricingSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingFailureComponent } from './pricing-failure.component';

describe('PricingFailureComponent', () => {
  let component: PricingFailureComponent;
  let fixture: ComponentFixture<PricingFailureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricingFailureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricingFailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

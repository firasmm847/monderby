import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetsfinishedComponent } from './betsfinished.component';

describe('BetsfinishedComponent', () => {
  let component: BetsfinishedComponent;
  let fixture: ComponentFixture<BetsfinishedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetsfinishedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BetsfinishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

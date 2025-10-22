import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoiceBetDialogComponent } from './choice-bet-dialog.component';

describe('ChoiceBetDialogComponent', () => {
  let component: ChoiceBetDialogComponent;
  let fixture: ComponentFixture<ChoiceBetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoiceBetDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoiceBetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

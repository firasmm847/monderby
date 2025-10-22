import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectWinnerDialogComponent } from './select-winner-dialog.component';

describe('SelectWinnerDialogComponent', () => {
  let component: SelectWinnerDialogComponent;
  let fixture: ComponentFixture<SelectWinnerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectWinnerDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectWinnerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

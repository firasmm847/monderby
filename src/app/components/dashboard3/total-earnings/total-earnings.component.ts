import { Component, OnInit } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-total-earnings',
  imports: [MaterialModule, TablerIconsModule],
  templateUrl: './total-earnings.component.html',
})
export class AppTotalEarningsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

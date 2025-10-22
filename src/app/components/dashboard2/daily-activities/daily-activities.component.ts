import { Component, OnInit } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-shop-daily-activities',
  imports: [MaterialModule, TablerIconsModule],
  templateUrl: './daily-activities.component.html',
})
export class AppShopDailyActivitiesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

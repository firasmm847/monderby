import { Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-monthly-revenue',
  imports: [MaterialModule, TablerIconsModule],
  templateUrl: './monthly-revenue.component.html',
})
export class AppMonthlyRevenueComponent {}

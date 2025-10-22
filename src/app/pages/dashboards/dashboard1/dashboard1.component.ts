import { Component } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';

// components

import { AppSocialCardComponent } from '../../../components/dashboard1/social-card/social-card.component';
import { AppWeeklyStatsComponent } from '../../../components/dashboard1/weekly-stats/weekly-stats.component';
import { AppWelcomeCardComponent } from 'src/app/components/dashboard1/welcome-card/welcome-card.component';

import { AppEarningsCardComponent } from 'src/app/components/dashboard1/earnings/earnings.component';
import { AppMonthlySalesComponent } from 'src/app/components/dashboard1/monthly-sales/monthly-sales.component';
import { AppSalesOverviewComponent } from 'src/app/components/dashboard1/sales-overview/sales-overview.component';

import { AppTotalSalesComponent } from 'src/app/components/dashboard1/total-sales/total-sales.component';
import { AppDailyActivitiesComponent } from 'src/app/components/dashboard1/daily-activities/daily-activities.component';
import { AppProductPerformanceComponent } from 'src/app/components/dashboard1/product-performance/product-performance.component';

@Component({
  selector: 'app-dashboard1',
  standalone: true,
  imports: [
    TablerIconsModule,
    AppSocialCardComponent,
    AppWeeklyStatsComponent,
    AppProductPerformanceComponent,
    AppWelcomeCardComponent,
    AppEarningsCardComponent,
    AppMonthlySalesComponent,
    AppSalesOverviewComponent,
    AppTotalSalesComponent,
    AppDailyActivitiesComponent,
    AppSocialCardComponent
  ],
  templateUrl: './dashboard1.component.html',
})
export class AppDashboard1Component {
  constructor() {}
}

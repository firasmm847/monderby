import { Component } from '@angular/core';

// components
import { AppWeeklyStatsComponent } from '../../../components/dashboard1/weekly-stats/weekly-stats.component';
import { AppYearlySalesComponent } from '../../../components/dashboard2/yearly-sales/yearly-sales.component';
import { AppProductPerformanceComponent } from '../../../components/dashboard2/product-performance/product-performance.component';
import { AppEarningsComponent } from 'src/app/components/dashboard2/earnings/earnings.component';
import { AppTopCardsComponent } from 'src/app/components/dashboard2/top-cards/top-cards.component';
import { AppMonthlyRevenueComponent } from 'src/app/components/dashboard2/monthly-revenue/monthly-revenue.component';
import { AppRecentTransactionsComponent } from 'src/app/components/dashboard2/recent-transactions/recent-transactions.component';
import { AppProductPerformanceTableComponent } from 'src/app/components/dashboard2/product-performance-table/product-performance-table.component';
import { AppMedicalproBrandingComponent } from 'src/app/components/dashboard2/medicalpro-branding/medicalpro-branding.component';
import { AppShopDailyActivitiesComponent } from 'src/app/components/dashboard2/daily-activities/daily-activities.component';

@Component({
  selector: 'app-dashboard2',
  standalone: true,
  imports: [
    AppWeeklyStatsComponent,
    AppYearlySalesComponent,
    AppProductPerformanceComponent,
    AppEarningsComponent,
    AppTopCardsComponent,
    AppMonthlyRevenueComponent,
    AppRecentTransactionsComponent,
    AppProductPerformanceTableComponent,
    AppMedicalproBrandingComponent,
    AppShopDailyActivitiesComponent,
  ],
  templateUrl: './dashboard2.component.html',
})
export class AppDashboard2Component {
  constructor() {}
}

import { Component } from '@angular/core';

// components
import { AppWeeklyStatsComponent } from '../../../components/dashboard1/weekly-stats/weekly-stats.component';
import { AppMedicalproBrandingComponent } from 'src/app/components/dashboard2/medicalpro-branding/medicalpro-branding.component';

import { AppSocialCardComponent } from 'src/app/components/dashboard1/social-card/social-card.component';
import { AppDailyActivitiesComponent } from 'src/app/components/dashboard1/daily-activities/daily-activities.component';
import { AppSalesOverviewTwoComponent } from 'src/app/components/dashboard3/sales-overview/sales-overview.component';
import { AppTotalSalesComponent } from 'src/app/components/dashboard1/total-sales/total-sales.component';
import { AppProductDataComponent } from 'src/app/components/dashboard3/product-data/product-data.component';
import { AppRevenueUpdatesComponent } from 'src/app/components/dashboard3/revenue-updates/revenue-updates.component';
import { AppMonthlyEarningsComponent } from 'src/app/components/dashboard3/monthly-earnings/monthly-earnings.component';
import { AppCustomersComponent } from 'src/app/components/dashboard3/customers/customers.component';
import { AppCongratulateCardComponent } from 'src/app/components/dashboard3/congratulate-card/congratulate-card.component';
import { AppPurchasesComponent } from 'src/app/components/dashboard3/purchases/purchases.component';
import { AppTotalEarningsComponent } from 'src/app/components/dashboard3/total-earnings/total-earnings.component';

@Component({
  selector: 'app-dashboard3',
  standalone: true,
  imports: [
    AppWeeklyStatsComponent,
    AppMedicalproBrandingComponent,
    AppSocialCardComponent,
    AppDailyActivitiesComponent,
    AppSalesOverviewTwoComponent,
    AppTotalSalesComponent,
    AppProductDataComponent,
    AppRevenueUpdatesComponent,
    AppMonthlyEarningsComponent,
    AppCustomersComponent,
    AppCongratulateCardComponent,
    AppPurchasesComponent,
    AppTotalEarningsComponent,
  ],
  templateUrl: './dashboard3.component.html',
})
export class AppDashboard3Component {
  constructor() {}
}

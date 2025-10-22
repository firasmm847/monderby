import { Component, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../material.module';

import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { TablerIconsModule } from 'angular-tabler-icons';

export interface SalesChartOption {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  grid: ApexGrid;
}

@Component({
  selector: 'app-sales-overview',
  imports: [MaterialModule, TablerIconsModule, NgApexchartsModule],
  templateUrl: './sales-overview.component.html',
})
export class AppSalesOverviewTwoComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public SalesChartOption!: Partial<SalesChartOption> | any;
  constructor() {
    this.SalesChartOption = {
      series: [
        {
          name: 'Ample Admin',
          data: [355, 390, 300, 350, 390, 180],
          color: 'var(--mat-sys-primary)',
        },
        {
          name: 'Pixel Admin',
          data: [280, 250, 325, 215, 250, 310],
          color: 'var(--mat-sys-secondary)',
        },
      ],

      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false,
        }
      },

      yaxis: {
        show: true,
        max: 400,
      },

      chart: {
        toolbar: {
          show: false,
        },
        type: 'bar',
        foreColor: '#adb0bb',
        fontFamily: "'DM Sans',sans-serif",
        height: 360,
      },

      legend: {
        show: false,
      },

      tooltip: {
        theme: 'dark',
      },

      grid: {
        show: true,
        borderColor: 'transparent',
        strokeDashArray: 2,
        padding: {
          left: 0,
          right: 0,
          bottom: -13,
        },
      },

      dataLabels: {
        enabled: false,
      },

      stroke: {
        show: true,
        width: 5,
        colors: ['none'],
      },

      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '42%',
          borderRadius: 5,
        },
      },
    };
  }
}

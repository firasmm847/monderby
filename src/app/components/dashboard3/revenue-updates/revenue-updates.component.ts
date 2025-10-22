import { Component, OnInit, ViewChild } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
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
import { MaterialModule } from 'src/app/material.module';

export interface RevenueChartOption {
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
  selector: 'app-revenue-updates',
  imports: [MaterialModule, TablerIconsModule, NgApexchartsModule],
  templateUrl: './revenue-updates.component.html',
})
export class AppRevenueUpdatesComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public RevenueChartOption!: Partial<RevenueChartOption> | any;

  constructor() {
    this.RevenueChartOption = {
      series: [
        {
          name: 'Earnings',
          data: [0, 5, 6, 8, 25, 9, 11, 24],
          color: 'var(--mat-sys-primary)',
        },
        {
          name: 'Expense',
          data: [0, 3, 1, 2, 8, 1, 5, 1],
          color: 'var(--mat-sys-secondary)',
        },
      ],

      xaxis: {
        categories: [
          '16/08',
          '17/08',
          '18/08',
          '19/08',
          '20/08',
          '21/08',
          '22/08',
          '23/08',
        ],
      },

      chart: {
        toolbar: {
          show: false,
        },
        type: 'line',
        foreColor: '#adb0bb',
        fontFamily: "'DM Sans',sans-serif",
        height: 290,
      },

      legend: {
        show: false,
      },

      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm',
        },
        theme: 'dark',
      },

      markers: {
        size: 4,
        border: 1,
      },

      grid: {
        show: true,
        borderColor: 'rgba(0, 0, 0, .2)',
        color: '#777e89',
        strokeDashArray: 2,
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },

      dataLabels: {
        enabled: false,
      },

      stroke: {
        curve: 'smooth',
        width: 3,
      },
    };
  }

  ngOnInit(): void {}
}

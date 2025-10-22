import { Component, ViewChild } from '@angular/core';
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

import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

export interface YearlyChartOption {
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
  selector: 'app-yearly-sales',
  imports: [NgApexchartsModule, MaterialModule, TablerIconsModule],
  templateUrl: './yearly-sales.component.html',
})
export class AppYearlySalesComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public YearlyChartOption!: Partial<YearlyChartOption> | any;

  constructor() {
    this.YearlyChartOption = {
      series: [25, 25, 25, 25],
      chart: {
        toolbar: {
          show: false,
        },
        foreColor: '#adb0bb',
        fontFamily: "'DM Sans',sans-serif",
        type: 'donut',
        height: 145,
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        theme: 'dark',
        fillSeriesColor: false,
      },
      labels: ['2021', '2020', '2019', '2018'],
      colors: ['var(--mat-sys-secondary)', '#1e4db7', '#fec90f', '#ecf0f2'],
      stroke: {
        colors: ['transparent'],
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            background: 'transparent',
            labels: {
              show: false,
              name: {
                show: true,
                fontSize: '18px',
                color: undefined,
                offsetY: -10,
              },
              value: {
                show: false,
                color: '#98aab4',
              },
              total: {
                show: false,
                label: 'Our Visitors',
                color: '#98aab4',
              },
            },
          },
        },
      },
    };
  }
}

import { Component, ViewChild } from '@angular/core';
import { MaterialModule } from '../../../material.module';
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
  ApexMarkers,
  NgApexchartsModule,
} from 'ng-apexcharts';


export interface MonthlyChartOption {
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
  colors: any;
  marker: ApexMarkers;
}

@Component({
  selector: 'app-monthly-sales',
  imports: [MaterialModule, TablerIconsModule, NgApexchartsModule],
  templateUrl: './monthly-sales.component.html',
})
export class AppMonthlySalesComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public MonthlyChartOption!: Partial<MonthlyChartOption> | any;

  constructor() {
    this.MonthlyChartOption = {
      series: [
        {
          name: 'Monthly Sales',
          data: [35, 60, 30, 55, 40],
          colors: ['var(--mat-sys-secondary)'],
        },
      ],

      chart: {
        toolbar: {
          show: false,
        },
        foreColor: '#adb0bb',
        fontFamily: "'DM Sans',sans-serif",
        type: 'area',
        height: 75,
        sparkline: {
          enabled: true,
        },
      },
      fill: {
        type: "gradient",
        colors: "var(--mat-sys-secondary)",
        gradient: {
          opacityFrom: 0.1,
          opacityTo: 0.01,
          stops: [100],
        },
      },

      colors: ['var(--mat-sys-secondary)'],

      marker: {
        size: 0,
      },

      tooltip: {
        theme: 'dark',
      },

      grid: {
        show: false,
      },

      stroke: {
        show: true,
        width: 2,
        curve: 'smooth',
      },
    };
  }
}

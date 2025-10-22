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
  ApexMarkers,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MaterialModule } from 'src/app/material.module';

export interface MonthEarningsChartOption {
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
  marker: ApexMarkers;
}

@Component({
  selector: 'app-monthly-earnings',
  imports: [NgApexchartsModule, MaterialModule, TablerIconsModule],
  templateUrl: './monthly-earnings.component.html',
})
export class AppMonthlyEarningsComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public MonthEarningsChartOption!: Partial<MonthEarningsChartOption> | any;

  constructor() {
    this.MonthEarningsChartOption = {
      series: [
        {
          name: 'Monthly Earnings',
          data: [6, 10, 9, 11, 9, 10, 12, 10, 9, 11, 9, 10, 12],
          color: 'rgba(255,255,255,0.5)',
        },
      ],

      chart: {
        toolbar: {
          show: false,
        },
        foreColor: '#adb0bb',
        fontFamily: "'DM Sans',sans-serif",
        type: 'bar',
        height: 45,
        sparkline: {
          enabled: true,
        },
      },

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
        colors: ['transparent'],
      },

      plotOptions: {
        bar: {
          horizontal: false,
          startingShape: 'flat',
          endingShape: 'flat',
          columnWidth: '30%',
          barHeight: '100%',
        },
      },
    };
  }

  ngOnInit(): void {}
}

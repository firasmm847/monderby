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

export interface CustomersChartOption {
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
  selector: 'app-customers',
  imports: [NgApexchartsModule, MaterialModule, TablerIconsModule],
  templateUrl: './customers.component.html',
})
export class AppCustomersComponent implements OnInit {
    @ViewChild('chart') chart: ChartComponent = Object.create(null);
    public CustomersChartOption!: Partial<CustomersChartOption> | any;

  constructor() {
    this.CustomersChartOption = {
        series: [
          {
            name: 'Customers',
            data: [1, 19, 3, 13, 2, 19],
            color: '#fff',
          },
        ],
  
        chart: {
          toolbar: {
            show: false,
          },
          foreColor: '#adb0bb',
          fontFamily: "'DM Sans',sans-serif",
          type: 'line',
          height: 55,
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
        },
      };
  }

  ngOnInit(): void {}
}

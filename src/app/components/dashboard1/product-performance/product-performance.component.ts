import { Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';


export interface productsData {
  id: number;
  imagePath: string;
  uname: string;
  position: string;
  productName: string;
  budget: number;
  priority: string;
}

const ELEMENT_DATA: productsData[] = [
  {
    id: 1,
    imagePath: 'assets/images/profile/user-1.jpg',
    uname: 'Sunil Joshi',
    position: 'Web Designer',
    productName: 'Elite Admin',
    budget: 3.9,
    priority: 'low'
  },
  {
    id: 2,
    imagePath: 'assets/images/profile/user-2.jpg',
    uname: 'Andrew McDownland',
    position: 'Project Manager',
    productName: 'Real Homes Theme',
    budget: 24.5,
    priority: 'medium'
  },
  {
    id: 3,
    imagePath: 'assets/images/profile/user-3.jpg',
    uname: 'Christopher Jamil',
    position: 'Project Manager',
    productName: 'MedicalPro Theme',
    budget: 12.8,
    priority: 'high'
  },
  {
    id: 4,
    imagePath: 'assets/images/profile/user-4.jpg',
    uname: 'Nirav Joshi',
    position: 'Frontend Engineer',
    productName: 'Hosting Press HTML',
    budget: 2.4,
    priority: 'critical'
  },
  {
    id: 5,
    imagePath: 'assets/images/profile/user-5.jpg',
    uname: 'Micheal Doe',
    position: 'Content Writer',
    productName: 'Helping Hands',
    budget: 9.3,
    priority: 'moderate'
  },
];

interface month {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-product-performance',
  imports: [MaterialModule, CommonModule],
  templateUrl: './product-performance.component.html',
})
export class AppProductPerformanceComponent {

  displayedColumns: string[] = ['assigned', 'name', 'priority', 'budget'];
  dataSource = ELEMENT_DATA;

  months: month[] = [
    { value: 'mar', viewValue: 'March 2025' },
    { value: 'apr', viewValue: 'April 2025' },
    { value: 'june', viewValue: 'June 2025' },
  ];
}

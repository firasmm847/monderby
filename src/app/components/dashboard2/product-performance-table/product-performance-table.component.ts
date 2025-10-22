import { Component, Inject, Optional, ViewChild, OnInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule } from '@angular/common';

export interface Employee {
  id: number;
  imagePath: string;
  Name: string;
  Category: string;
  Percent: number;
  Review: string;
  Earnings: number;
}

const employees = [
  {
    id: 1,
    imagePath: 'assets/images/products/1.jpg',
    Name: 'Is it good butterscotch ice-cream?',
    Category: 'Ice-Cream, Milk, Powder',
    Percent: 65,
    Review: 'good',
    Earnings: '546,000',
  }, 
  {
    id: 2,
    imagePath: 'assets/images/products/2.jpg',
    Name: 'Supreme fresh tomato available',
    Category: 'Market, Mall',
    Percent: 98,
    Review: 'good',
    Earnings: '780,000',
  },
  {
    id: 3,
    imagePath: 'assets/images/products/3.jpg',
    Name: 'Red color candy from Gucci',
    Category: 'Chocolate, Yummy',
    Percent: 46,
    Review: 'bad',
    Earnings: '457,000',
  },
  {
    id: 4,
    imagePath: 'assets/images/products/4.jpg',
    Name: 'Stylish night lamp for night',
    Category: 'Elecric, Wire, Current',
    Percent: 23,
    Review: 'bad',
    Earnings: '125,000',
  },
];

@Component({
  selector: 'app-product-performance-table',
  imports: [MaterialModule, TablerIconsModule, CommonModule],
  templateUrl: './product-performance-table.component.html',
})
export class AppProductPerformanceTableComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> =
    Object.create(null);
  displayedColumns: string[] = ['items', 'reviews', 'earnings', 'action'];
  dataSource = new MatTableDataSource(employees);

  constructor(public dialog: MatDialog) { }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(ProductsDialogContentComponent, {
      data: obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }

  // tslint:disable-next-line - Disables all
  deleteRowData(row_obj: Employee): boolean | any {
    this.dataSource.data = this.dataSource.data.filter((value: any) => {
      return value.id !== row_obj.id;
    });
  }

  ngOnInit(): void { }
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-dialog-content',
  imports: [MaterialModule],
  templateUrl: './dialog-content.html',
})
// tslint:disable-next-line: component-class-suffix
export class ProductsDialogContentComponent {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;

  constructor(
    public dialogRef: MatDialogRef<ProductsDialogContentComponent>,
    // @Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Employee
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
  }

  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }
  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}

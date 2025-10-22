import { Component, OnInit } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-purchases',
  imports: [MaterialModule, TablerIconsModule],
  templateUrl: './purchases.component.html',
})
export class AppPurchasesComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

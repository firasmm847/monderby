import { Component, OnInit } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-congratulate-card',
  imports: [MaterialModule, TablerIconsModule],
  templateUrl: './congratulate-card.component.html',
})
export class AppCongratulateCardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

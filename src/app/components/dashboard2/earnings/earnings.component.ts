import { Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-earnings',
  imports: [MaterialModule, TablerIconsModule],
  templateUrl: './earnings.component.html',
})
export class AppEarningsComponent {}

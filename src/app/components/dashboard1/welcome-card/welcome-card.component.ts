import { Component } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-welcome-card',
  imports: [MaterialModule, TablerIconsModule],
  templateUrl: './welcome-card.component.html',
})
export class AppWelcomeCardComponent {}

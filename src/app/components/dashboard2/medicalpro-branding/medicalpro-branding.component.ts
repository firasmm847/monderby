import { Component } from '@angular/core';

import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-medicalpro-branding',
  imports: [MaterialModule, TablerIconsModule],
  templateUrl: './medicalpro-branding.component.html',
})
export class AppMedicalproBrandingComponent {
  constructor() {}
}

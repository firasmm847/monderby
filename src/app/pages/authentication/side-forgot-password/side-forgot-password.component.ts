import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { BrandingComponent } from '../../../layouts/full/vertical/sidebar/branding.component';
import { AuthenticationService } from 'src/app/services/apps/authentication/authentication.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-side-forgot-password',
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    BrandingComponent,
  ],
  templateUrl: './side-forgot-password.component.html',
})
export class AppSideForgotPasswordComponent {
  options = this.settings.getOptions();
  step1 = true;
  error = '';
  errorrenew = '';
  passIsRecover = false;
  isNew = false;

  constructor(private settings: CoreService, private router: Router, private _authenticationService: AuthenticationService) {}

  form = new FormGroup({
    email: new FormControl('', [Validators.required]),
  });
  formreset = new FormGroup({
    code: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    newpassword: new FormControl('', [Validators.required])
  });

  get f() {
    return this.form.controls;
  }

  get freset() {
    return this.formreset.controls;
  }

  submit() {
    // console.log(this.form.value);
    //this.router.navigate(['/dashboards/dashboard1']);
    //console.log( 'recovering password for ' + this.email );
    this._authenticationService.recoverPw(this.f.email.value as string)
      .pipe(first())
      .subscribe(
        data => {
          this.error = '';
          this.passIsRecover = true;
          this.step1 = false;
        },
        err => {
          const error = err.error;
          const errorS = error.message;
          this.error = error['hydra:description'];
        }
      );
  }

  resetPsw() {
    if( this.freset.password.value != this.freset.newpassword.value) {
      alert("les mots de passe sont incompatibles "+this.freset.password.value+" - "+this.freset.newpassword.value);
      return;
    }
    //console.log('Canging password with ' + this.password);
    this._authenticationService.setNew( this.freset.password.value as string, this.freset.code.value as string )
      .pipe(first())
      .subscribe(
        () => {
          this.errorrenew = '';
          this.isNew = true;
          console.log("changed");
        },
        err => {
          const error = err.error;
          this.errorrenew = error['hydra:description'];
          //console.log(this.error);
        }
      );
  }

}

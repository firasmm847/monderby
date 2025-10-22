import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { BrandingComponent } from '../../../layouts/full/vertical/sidebar/branding.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { AuthenticationService } from 'src/app/services/apps/authentication/authentication.service';
import { first } from 'rxjs';
import Swal from 'sweetalert2';
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function optionalMinLengthValidator(minLength: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    // Si vide = OK (champ optionnel)
    if (!value) {
      return null;
    }

    // Si non vide et longueur < minLength = erreur
    if (value.length < minLength) {
      return { optionalMinLength: { requiredLength: minLength, actualLength: value.length } };
    }

    return null;
  };
}

@Component({
    selector: 'app-side-register',
    imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, BrandingComponent, TablerIconsModule],
    templateUrl: './side-register.component.html'
})
export class AppSideRegisterComponent {
  options = this.settings.getOptions();

  constructor(private settings: CoreService, private router: Router, private _authenticationService: AuthenticationService) { }

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lname: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required]),
    pays: new FormControl('', [Validators.required, Validators.minLength(2)]),
    password: new FormControl('', [Validators.required]),
    parrain: new FormControl('', [optionalMinLengthValidator(8)]),
  });

  get f() {
    return this.form.controls;
  }

  /*submit() {
    // console.log(this.form.value);
    this.router.navigate(['/dashboards/dashboard1']);
  }*/

  submit() {
      /*
    this.submitted = true;
    var element = <HTMLInputElement> document.getElementById("register-privacy-policy");
    var isChecked = element.checked;*/
    
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    var self = this;
    /*
    if (!isChecked){
      Swal.fire({
        icon: 'warning',
        title: 'ERROR!',
        text: 'You must check the policy conditions',
        customClass: {
          confirmButton: 'btn btn-danger'
        }
      });
      return;
    }

    console.log("yeah"+this.registerForm.controls['lastname'].value);
    var self = this;*/
    this._authenticationService
      .register(this.f.email.value as string, this.f.uname.value as string, this.f.lname.value as string, this.f.pays.value as string, this.f.password.value as string, this.f.parrain.value as string)
      .pipe(first())
      .subscribe(
        data => {
          Swal.fire({
            icon: 'success',
            title: 'Email sent, please check your box!!',
            text: '',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          }).then(function (result) {
            if (result.value) {
              self.router.navigate(['/authentication/login']);
              //this._router.navigate(['/pages/authentication/login-v2']);
            }
          });
        },
        error => {
          console.log("errors");
          Swal.fire({
            icon: 'warning',
            title: 'ERROR!',
            text: '',
            customClass: {
              confirmButton: 'btn btn-danger'
            }
          });
        }
      );
  }
}

import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { BrandingComponent } from '../../../layouts/full/vertical/sidebar/branding.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { AuthenticationService } from 'src/app/services/apps/authentication/authentication.service';
import { first } from 'rxjs';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

// En haut de ton composant
declare global {
  interface Window {
    FB: any;
    google: any;
  }
}

@Component({
  selector: 'app-side-login',
  imports: [
    RouterModule,
    MaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrandingComponent,
    TablerIconsModule,
  ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent implements OnInit{
  options = this.settings.getOptions();
  token: string | null = null;
  activated = false;
  message = "Votre compte est en cours d'activation";
  error = '';

  constructor(private settings: CoreService, private router: Router, private route: ActivatedRoute, private _authenticationService: AuthenticationService) {}

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if(params.get('token')){
        const token = params.get('token');
        if (token) {
          this.token = token.replace("https:", "");
          console.log("token", this.token);
          this.activateAccount(this.token);
        }
      }
    });
  }

  activateAccount(userToken : any){
    //console.log('your userToken ' + userToken);
    this._authenticationService.confirm(userToken)
     .subscribe(
       data => {
         this.activated = true;
         this.message = 'Votre compte est activé. Vous pouvez maintenant vous connectez.';
       },
       err => {
         this.message = "";
 
         const error = err.error;
         const errorS = error.message;
         const errorD = error.detail;
         const errordescription = err.error['hydra:description'];
         if (errordescription) {
           this.error = errordescription;
         }
         else if (errorD){  
           this.error = JSON.stringify(errorD);
         }else if (errorS) {
           this.error = JSON.stringify(errorS);
         } else {
           this.error = JSON.stringify(error);
         }
       }
     );
   }

  onSubmit() {
    // console.log(this.form.value);
    this.router.navigate(['/dashboards/dashboard1']);
  }

  submit() {
    //this.submitted = true;
    console.log(this.form.value);

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    // Login
    //this.loading = true;
    this._authenticationService
      .login(this.f.uname.value as string, this.f.password.value as string)
      .pipe(first())
      .subscribe(
          data => {
            console.log("SUCCESS", data);
            if (data) this.router.navigate(['/']);
          },
          (error) => {
            console.error("ERROR", error);
            this.error = 'email / mot de passe incorrect';
          }
        );
  }

  //-------- start gmail or facebook
  // Dans ton login.component.ts existant
async loginWithGoogle(): Promise<void> {
  try {
    // Chargement du SDK Google
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    document.head.appendChild(script);
    
    script.onload = () => {
      (window as any).google.accounts.id.initialize({
        client_id: 'TON_GOOGLE_CLIENT_ID',
        callback: (response: any) => {
          // Décoder les infos utilisateur
          const userData = this.decodeGoogleToken(response.credential);
          this.saveUserAndRedirect(userData);
        }
      });
      
      (window as any).google.accounts.id.prompt();
    };
  } catch (error) {
    console.error('Erreur Google:', error);
  }
}

private decodeGoogleToken(token: string): any {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return {
    name: payload.name,
    email: payload.email,
    picture: payload.picture
  };
}

private saveUserAndRedirect(userData: any): void {
  localStorage.setItem('user', JSON.stringify(userData));
  this.router.navigate(['/dashboard']);
}

async loginWithFacebook(): Promise<void> {
  // Utilise (window as any).FB au lieu de window.FB
  if (!(window as any).FB) {
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/fr_FR/sdk.js';
    document.head.appendChild(script);
    
    script.onload = () => {
      (window as any).FB.init({
        appId: 'TON_FACEBOOK_APP_ID',
        version: 'v18.0'
      });
      this.doFacebookLogin();
    };
  } else {
    this.doFacebookLogin();
  }
}

private doFacebookLogin(): void {
  const FB = (window as any).FB;
  FB.login((response: any) => {
    if (response.authResponse) {
      FB.api('/me', {fields: 'name,email,picture'}, (user: any) => {
        this.saveUserAndRedirect(user);
      });
    }
  }, {scope: 'email'});
}
/*
loginWithFacebook(): void {
  // Redirection directe vers Facebook OAuth (plus fiable)
  const fbAppId = 'TON_FACEBOOK_APP_ID';
  const redirectUri = encodeURIComponent('http://localhost:4200/auth/facebook/callback');
  const scope = 'email,public_profile';
  
  const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${fbAppId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
  
  window.location.href = facebookAuthUrl;
}*/
}

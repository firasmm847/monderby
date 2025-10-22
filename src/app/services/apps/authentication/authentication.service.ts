import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { User, Role } from 'src/app/models';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

declare var google: any;
declare var FB: any;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photo: string;
  provider: 'google' | 'facebook';
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  private googleInitialized = false;
  private facebookInitialized = false;

  //public
  public currentUser: Observable<User | null>;
  public user: User;
  uriApi = environment.API_URL;

  //private
  private currentUserSubject: BehaviorSubject<User | null>;;

  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */
  constructor(private _http: HttpClient, private _toastrService: ToastrService, private router: Router) {
    const userJson = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
    JSON.parse(localStorage.getItem('currentUser') || 'null')
  );

    this.currentUser = this.currentUserSubject.asObservable();
  }

  // getter: currentUserValue
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   *  Confirms if user is admin
   */
  get isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return !!user && user.role === Role.Admin;
  }

  /**
   *  Confirms if user is client
   */
  get isClient() {
    const user = this.currentUserSubject.value;
    return !!user && user.role === Role.Client;
  }

  /**
   *  Confirms if user is agent
   */
   get isAgent() {
    const user = this.currentUserSubject.value;
    return !!user && user.role === Role.E2;
  }

  confirm(token: string) {
    return this._http.post(`${environment.API_URL}/pub/user-confirmation`, { confirmationToken: token })
      .pipe(map(resp => {
        return resp;
      }));
  }

  /**
   * User login
   *
   * @param email
   * @param password
   * @returns user
   */
   login(email: string, password: string) {
    return this._http
      .post<any>(`${environment.API_URL}/pub/login`, { "email": email, "plainPassword": password })
      .pipe(
        map(response => {
          if (response && response.token && !response.error) {
            localStorage.setItem('currentUser', JSON.stringify(response));
            localStorage.setItem('token', JSON.stringify(response.token).slice(1, -1));
            localStorage.setItem('iduser', JSON.stringify(response.id));    
            localStorage.setItem('username', response.givenName); 
            localStorage.setItem('fullName', response.fullName);
            localStorage.setItem('role', response.roles);
            this.currentUserSubject.next(response);
          }

          return response;
        })
      );
  }

  get logIn(): boolean {
    return !!localStorage.getItem('token'); // Vérifier la présence du token dans le localStorage
  }

  recoverPw(email: string) {
    return this._http.post(`${environment.API_URL}/pub/forgot-password-request`, { email: email })
      .pipe(map(resp => {
        return resp;
      }));
  }

  setNew(password: string, token: string) {
    //console.log('{ passwordResetToken: ' + token + ', plainPassword: ' + password + ' }');
    return this._http.post(`${environment.API_URL}/pub/reset-password-confirmation`, { passwordResetToken: token, plainPassword: password })
      .pipe(map(resp => {
        return resp;
      }));
  }



  register(email: string, firstname: string, lastname: string, country: string, password: string, parrain: string) {
    return this._http
      .post<any>(`${environment.API_URL}/pub/register`, { "email": email, "firstname": firstname,"lastname": lastname,"country": country, "plainPassword": password, "roles": ["ROLE_CLIENT"], "referralCode": parrain})
      .pipe(
        map(response => {
          

          return response.status;
        })
      );
  }

  addUser(email: string, firstname: string, lastname: string, country: string, tel: string, password: string, role: string) {
    return this._http
      .post<any>(`${environment.API_URL}/adduser`, { "firstname": firstname,"lastname": lastname,"country": country,"tel": tel, "password": password , "email": email, "roles": role})
      .pipe(
        map(response => {
          

          return response;
        })
      );
  }

  sendResetLink(email: string) {
    return this._http
      .post<any>(`${environment.API_URL}/forgetPsw`, { "email": email})
      .pipe(
        map(response => {
          return response.status;
        })
      );
  }


  resetPassword(newpassword: string, token: string) {
    return this._http
      .post<any>(`${environment.API_URL}/resetPsw`, { "token": token, "newpassword": newpassword})
      .pipe(
        map(response => {
          

          return response.status;
        })
      );
  }

  verifyAccount(token: string) {
    return this._http
      .post<any>(`${environment.API_URL}/activation`, { "token": token})
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  getPost(id: string) {
    return this._http
      .get<any>(`${environment.API_URL}/track/tracking/`+id, {})
      .pipe(
        map(response => {
          console.log("json "+JSON.stringify(response))
          return response;
        })
      );
  }

  getFilesByPost(id: number){
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({
     'Content-Type': 'application/json',
     'Authorization': `Bearer ${auth_token}`
    });
   
    const requestOptions = { headers: headers };
    return this._http.get(`${environment.API_URL}/files/${id}`, requestOptions).pipe(
      map(response => {
        return response;
      })
    );
  }

  getFilesBoxesByPost(id: number){
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({
     'Content-Type': 'application/json',
     'Authorization': `Bearer ${auth_token}`
    });
   
    const requestOptions = { headers: headers };
    return this._http.get(`${environment.API_URL}/filesboxes/${id}`, requestOptions).pipe(
      map(response => {
        return response;
      })
    );
  }

  getFilesRealsByPost(id: number){
    let auth_token = localStorage.getItem('token');
    const headers = new HttpHeaders({
     'Content-Type': 'application/json',
     'Authorization': `Bearer ${auth_token}`
    });
   
    const requestOptions = { headers: headers };
    return this._http.get(`${environment.API_URL}/filesreals/${id}`, requestOptions).pipe(
      map(response => {
        return response;
      })
    );
  }


  udapteUserImage(imageFile : File | null = null) {
    console.log("udapteUserImage")
    const currentUser = localStorage.getItem('currentUser');
    const token = currentUser ? JSON.parse(currentUser)?.token : null;
    const id = currentUser ? JSON.parse(currentUser)?.id : null;
    let formData:FormData = new FormData();
    if (imageFile) {
      formData.append('imageFile', imageFile);
    } 
    let options = {
      headers: new HttpHeaders({
        //'Content-Type': "multipart/form-data; charset=utf-8; boundary=" + Math.random().toString().substr(2),
        'Authorization': 'Bearer ' + token
      })
    };

    return this._http.post(this.uriApi +'/users/'+id+'/profil', formData, options)
    .pipe(map((res: any) => {
        if (res?.imageUrl) {
          const userStr = localStorage.getItem('currentUser');
          if(userStr){
            const user = userStr ? JSON.parse(userStr) : null;
            user.imageUrl = res.imageUrl;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUser = user;
          }
        }
        return res;
      })
    );


  }


  /**
   * User logout
   *
   */
  logoutFromApp() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    localStorage.removeItem('iduser');
    localStorage.removeItem('username');
    localStorage.removeItem('fullName');
    localStorage.removeItem('role');
    this.currentUserSubject.next(null);
  }

  //--------start gmail or facebook
  // Initialiser Google API
  async initializeGoogle(): Promise<void> {
    if (this.googleInitialized) return;

    return new Promise((resolve, reject) => {
      if (typeof google !== 'undefined') {
        google.accounts.id.initialize({
          client_id: 'TON_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
          callback: (response: any) => {
            this.handleGoogleCallback(response);
          }
        });
        this.googleInitialized = true;
        resolve();
      } else {
        // Charger le SDK Google
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = () => {
          google.accounts.id.initialize({
            client_id: 'TON_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
            callback: (response: any) => {
              this.handleGoogleCallback(response);
            }
          });
          this.googleInitialized = true;
          resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
      }
    });
  }

  // Initialiser Facebook SDK
  async initializeFacebook(): Promise<void> {
    if (this.facebookInitialized) return;

    return new Promise((resolve, reject) => {
      if (typeof FB !== 'undefined') {
        FB.init({
          appId: 'TON_FACEBOOK_APP_ID',
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
        this.facebookInitialized = true;
        resolve();
      } else {
        // Charger le SDK Facebook
        const script = document.createElement('script');
        script.src = 'https://connect.facebook.net/fr_FR/sdk.js';
        script.onload = () => {
          FB.init({
            appId: 'TON_FACEBOOK_APP_ID',
            cookie: true,
            xfbml: true,
            version: 'v18.0'
          });
          this.facebookInitialized = true;
          resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
      }
    });
  }

  // Connexion Google
  async loginWithGoogle(): Promise<UserProfile | null> {
    try {
      await this.initializeGoogle();
      
      return new Promise((resolve, reject) => {
        google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Fallback avec popup
            google.accounts.oauth2.initTokenClient({
              client_id: 'TON_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
              scope: 'profile email',
              callback: async (response: any) => {
                try {
                  const profile = await this.getGoogleProfile(response.access_token);
                  resolve(profile);
                } catch (error) {
                  reject(error);
                }
              }
            }).requestAccessToken();
          }
        });
        
        // Timeout après 10 secondes
        setTimeout(() => {
          reject(new Error('Timeout de connexion Google'));
        }, 10000);
      });
    } catch (error) {
      console.error('Erreur Google Auth:', error);
      throw error;
    }
  }

  // Récupérer profil Google
  private async getGoogleProfile(accessToken: string): Promise<UserProfile> {
    const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
    const data = await response.json();
    
    const profile: UserProfile = {
      id: data.id,
      name: data.name,
      email: data.email,
      photo: data.picture,
      provider: 'google'
    };
    
    this.saveUserProfile(profile);
    return profile;
  }

  // Callback Google (pour One Tap)
  private handleGoogleCallback(response: any): void {
    try {
      // Décoder le JWT token
      const payload = this.decodeJWT(response.credential);
      
      const profile: UserProfile = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        photo: payload.picture,
        provider: 'google'
      };
      
      this.saveUserProfile(profile);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Erreur callback Google:', error);
    }
  }

  // Connexion Facebook
  async loginWithFacebook(): Promise<UserProfile | null> {
    try {
      await this.initializeFacebook();
      
      return new Promise((resolve, reject) => {
        FB.login((response: any) => {
          if (response.authResponse) {
            // Récupérer les infos utilisateur
            FB.api('/me', { fields: 'id,name,email,picture' }, (userInfo: any) => {
              const profile: UserProfile = {
                id: userInfo.id,
                name: userInfo.name,
                email: userInfo.email || '',
                photo: userInfo.picture?.data?.url || '',
                provider: 'facebook'
              };
              
              this.saveUserProfile(profile);
              resolve(profile);
            });
          } else {
            reject(new Error('Connexion Facebook annulée'));
          }
        }, { scope: 'email,public_profile' });
      });
    } catch (error) {
      console.error('Erreur Facebook Auth:', error);
      throw error;
    }
  }

  // Décoder JWT (pour Google One Tap)
  private decodeJWT(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      throw new Error('Token JWT invalide');
    }
  }

  // Sauvegarder profil utilisateur
  private saveUserProfile(profile: UserProfile): void {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    console.log('Profil sauvegardé:', profile);
  }

  // Récupérer utilisateur actuel
  getCurrentUser(): UserProfile | null {
    const profile = localStorage.getItem('userProfile');
    return profile ? JSON.parse(profile) : null;
  }

  // Vérifier si connecté
  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  // Déconnexion
  async logout(): Promise<void> {
    const user = this.getCurrentUser();
    
    if (user?.provider === 'google') {
      google.accounts.id.disableAutoSelect();
    } else if (user?.provider === 'facebook') {
      FB.logout();
    }
    
    localStorage.removeItem('userProfile');
    this.router.navigate(['/login']);
  }
  
}

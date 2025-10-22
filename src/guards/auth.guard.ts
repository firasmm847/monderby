import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/apps/authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(): boolean {
    // Vérifie si l'utilisateur est connecté
    if (!this.authService.logIn) {
        console.log("noot connnected")
      // Si non, redirige vers la page de login et sauvegarde l'URL initiale pour rediriger après la connexion
      //localStorage.setItem('returnUrl', window.location.pathname);
      this.router.navigate(['/login']);
      return false;
    }
        console.log("connnected")
    return true;  // Si l'utilisateur est connecté, il peut accéder à la route protégée
  }
}

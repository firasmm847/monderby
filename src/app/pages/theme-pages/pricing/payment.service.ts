import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  uriApi = environment.API_URL;
  constructor(private http: HttpClient) {}

  charge(data: { token: string, packType: string }): Observable<any> {
    const currentUserString = localStorage.getItem('currentUser');
    let headers = new HttpHeaders();

    if (currentUserString) {
      const currentUser = JSON.parse(currentUserString);
      if (currentUser?.token) {
        headers = headers.set('Authorization', 'Bearer ' + currentUser.token);
      }
    }
    return this.http.post(this.uriApi + '/payment/charge', data, { headers });
  }

  sendForStripe(): Observable<any> {
    const currentUserString = localStorage.getItem('currentUser');
    let headers = new HttpHeaders();

    if (currentUserString) {
      const currentUser = JSON.parse(currentUserString);
      if (currentUser?.token) {
        headers = headers.set('Authorization', 'Bearer ' + currentUser.token);
      }
    }
    return this.http.post(this.uriApi + '/stripe/checkout', {}, { headers });
  }

  createCheckoutSession(data: { packType: string }): Observable<any> {
    const currentUserString = localStorage.getItem('currentUser');
    let headers = new HttpHeaders();

    if (currentUserString) {
      const currentUser = JSON.parse(currentUserString);
      if (currentUser?.token) {
        headers = headers.set('Authorization', 'Bearer ' + currentUser.token);
      }
    }
    return this.http.post(this.uriApi + '/create-checkout-session', data, { headers });
  }
}

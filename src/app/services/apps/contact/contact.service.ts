import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { map } from 'rxjs';
import { Contact } from 'src/app/pages/apps/contact/contact';
import { contactList } from 'src/app/pages/apps/contact/contactData';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private contacts = signal<Contact[]>(contactList);
  currentUser: any = null;
  httpOptions: any;

  constructor(private _http: HttpClient) {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  }

  httpOptionsR() {
    if (this.currentUser !== null) {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.currentUser['token']
        })
      };
    }
    return this.httpOptions;
  }

  public getContacts() {
    return this.contacts();
  }
  
  getContactsoff() {
    const httpOptionsG = this.httpOptionsR(); 
    return this._http.get(environment.API_URL+'/users?perPage=1000&order[familyName]=ASC', httpOptionsG).pipe( map ( res => {
      return res;
    }));
  }

  public addContact(contact: Contact) {
    this.contacts.set([contact, ...this.contacts()]);
  }

  public filterContacts(searchText: string): Contact[] {
    return this.contacts().filter((contact) =>
      contact.contactname.toLowerCase().includes(searchText.toLowerCase())
    );
  }
}

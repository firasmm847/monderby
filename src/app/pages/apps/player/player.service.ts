import { Injectable, signal } from '@angular/core';
import { Player } from 'src/app/pages/apps/player/player';
import { employees } from 'src/app/pages/apps/employee/employeeData';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface ApiResponse<T> {
  'data': T[];
  'success': boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PlayerService {

  auth_token: any;

  constructor(private http: HttpClient) {
    this.auth_token = localStorage.getItem('token');
  }

  public getPlayersRanking(): Observable<Player[]> {
        const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.auth_token}`
        });
        const requestOptions = { headers: headers };

      return this.http.get<ApiResponse<Player>>(`${environment.API_URL}/ranking`, requestOptions).pipe(
        map(response => response['data'])
      );
  }

  /*addEmployee(employee: Employee): void {
    employee.id = this.employees().length + 1;
    this.employees.update((employees) => [...employees, employee]);
  }

  updateEmployee(updatedEmployee: Employee): void {
    this.employees.update((employees) => {
      const index = employees.findIndex((e) => e.id === updatedEmployee.id);
      if (index !== -1) {
        employees[index] = updatedEmployee;
      }
      return [...employees];
    });
  }

  deleteEmployee(employeeId: number): void {
    this.employees.update((employees) =>
      employees.filter((e) => e.id !== employeeId)
    );
  }*/
}

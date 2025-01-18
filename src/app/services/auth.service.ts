import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) { }

  //El método login hace la solicitud POST al servidor con los datos del usuario.
  login(email: string, password: string): Observable<any> {
    const data = { email, password };
    return this.http.post(`${this.baseUrl}/users/token/`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }
}

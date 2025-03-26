import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://127.0.0.1:8000/api/v1/users/';

  constructor(private http: HttpClient) { }

  //El método login hace la solicitud POST al servidor con los datos del usuario.
  login(email: string, password: string): Observable<any> {
    const data = { email, password };
    return this.http.post(`${this.baseUrl}token/`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  //Crear un usuario POST(empleado)
  registerUser(name: string, last_name: string, email: string, password: string, identification: string,
    phone_number: string, address: string
  ): Observable<any> {
    const data = {name, last_name, email, password, identification, phone_number, address};
    return this.http.post(`${this.baseUrl}`, data, {
     headers: new HttpHeaders({'Content-Type': 'application/json'}) 
    });
  }

  //Listar usuarios GET (empleados)
  listUsers(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  //Actualizar usuarios PUT (empleados)
  updateUser(user_id: number, userData: any): Observable<any>{
    return this.http.put(`${this.baseUrl}${user_id}/`, userData, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  //Eliminar usuario DELETE (empleados)
  deleteUser(user_id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}${user_id}/`);
  }
}

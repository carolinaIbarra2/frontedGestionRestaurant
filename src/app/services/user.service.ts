import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://127.0.0.1:8000/api/v1/users/';
  private baseUrlRoles = 'http://127.0.0.1:8000/api/v1/roles/';

  constructor(private http: HttpClient) { }


  // Método privado para obtener los headers con autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Token ${token}`,  // Agregar token en el header
      'Content-Type': 'application/json'
    });
  }

  //El método login hace la solicitud POST al servidor con los datos del usuario.
  login(email: string, password: string): Observable<any> {
    const data = { email, password };
    return this.http.post<{ token: string }>(`${this.baseUrl}token/`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }).pipe(
      tap(response => {
        if (response && response.token) { 
          localStorage.setItem('token', response.token);
        } else {
          console.error('No se recibió un token válido.');
        }
      })
    );
  }

  //Obtener roles desde el backend
  getRoles(): Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrlRoles}`, { headers: this.getAuthHeaders() });
  }

  //Crear un usuario POST(empleado)
  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, userData, { headers: this.getAuthHeaders() });
  
  }

  //Listar usuarios GET (empleados)
  listUsers(): Observable<any[]> {
    return this.http.get<UserResponse>(this.baseUrl, { headers: this.getAuthHeaders() })
    .pipe(
      tap(response => console.log('Respuesta de listUsers:', response)), // Verifica la respuesta
      map(response => response.items || []) // Extrae solo la lista de usuarios
    );
  }

  // Obtener un usuario por su ID
  getUserById(user_id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}${user_id}/`, { headers: this.getAuthHeaders() })
    ;
  }

  //Actualizar usuarios PUT (empleados)
  updateUser(user_id: number, userData: any): Observable<any>{
    return this.http.put(`${this.baseUrl}${user_id}/`, userData, { headers: this.getAuthHeaders() });  
  }

  //Eliminar usuario DELETE (empleados)
  deleteUser(user_id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}${user_id}/`, { headers: this.getAuthHeaders() });
  }
}


// Definir la interfaz `UserResponse`
interface UserResponse {
  items: any[];
}
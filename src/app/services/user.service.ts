import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedResponse } from 'src/app/models/pagination-interface'


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://127.0.0.1:8000/api/v1/users/';
  private baseUrlRoles = 'http://127.0.0.1:8000/api/v1/roles/';

  constructor(private http: HttpClient) { }


  // Método privado para obtener los headers con autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token') || '';
    return new HttpHeaders({
      'Authorization': `Token ${token}`,  // Agregar token en el header
      'Content-Type': 'application/json'
    });
  }

  //El método login hace la solicitud POST al servidor con los datos del usuario.
  login(email: string, password: string): Observable<any> {
    const data = { email, password };
    return this.http.post<any>(`${this.baseUrl}token/`, data).pipe(
      tap(response => {
        if (response?.token && response?.refresh_token) {
          // Guarda ambos tokens
          localStorage.setItem('access_token', response.token);
          localStorage.setItem('refresh_token', response.refresh_token);
        } else {
          console.error('Tokens no recibidos correctamente.');
        }
      })
    );
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return new Observable();
  
    return this.http.post<any>(`${this.baseUrl}token/update/`, {
      refresh: refreshToken
    }).pipe(
      tap(response => {
        if (response?.token) {
          localStorage.setItem('access_token', response.token);
        }
      })
    );
  }
  

  //Obtener roles desde el backend
  getRoles(): Observable<any>{
    return this.http.get<any>(`${this.baseUrlRoles}`, { headers: this.getAuthHeaders() });
  }

  //Crear un usuario POST(empleado)
  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, userData, { headers: this.getAuthHeaders() });
  
  }

  //Listar usuarios GET (empleados)
  listUsers(page: number = 1): Observable<PaginatedResponse> {
    return this.http.get<PaginatedResponse>(`${this.baseUrl}?page=${page}`, { headers: this.getAuthHeaders() })
    .pipe(
      tap(response => console.log('Respuesta de listUsers:')), // Depuración
      map(response => ({
        items: response.items || [],
        total_pages: response.total_pages,
        current_page: response.current_page,
        total_items: response.total_items
      }))
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

  //Actualizar contraseña
  updatePassword(currentPassword: string, newPassword: string): Observable<any>{
    const data = {
      currentPassword: currentPassword,
      newPassword: newPassword
    };
    return this.http.put(`${this.baseUrl}update-password/`, data, { headers: this.getAuthHeaders() });
  }
}


// Definir la interfaz `UserResponse`
interface UserResponse {
  items: any[];
}
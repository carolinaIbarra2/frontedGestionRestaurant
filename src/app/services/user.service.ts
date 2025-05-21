import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedResponse } from 'src/app/models/pagination-interface'
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://127.0.0.1:8000/api/v1/users/';
  private baseUrlRoles = 'http://127.0.0.1:8000/api/v1/roles/';

  constructor(private http: HttpClient, private router: Router) { }


  // Método privado para obtener los headers con autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,  // Agregar token en el header
      'Content-Type': 'application/json'
    });
  }

  //El método login hace la solicitud POST al servidor con los datos del usuario.
  login(email: string, password: string): Observable<any> {
    const data = { email, password };
    return this.http.post<any>(`${this.baseUrl}token/`, data).pipe(
      tap(response => {
        if (response?.access_token && response?.refresh_token) {
          // Guarda ambos tokens
          localStorage.setItem('access_token', response.access_token);  //nombres en backend
          localStorage.setItem('refresh_token', response.refresh_token); //nombres en backend
        
          const user = {
            id: response.user_id,
            email: response.email
          };
          localStorage.setItem('user', JSON.stringify(user));

        } else {
          console.error('Tokens no recibidos correctamente.');
        }
      }),
      catchError(error => {
        console.error('Error en login:', error);
        return throwError(() => new Error('Error en login'));
      })
    );
  }
  

  //Obtener roles desde el backend
  getRoles(): Observable<any>{
    return this.http.get<any>(`${this.baseUrlRoles}`, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error('Error en getRoles:', error);
        return throwError(() => new Error('Error al obtener los roles.'));
      })
    );
  }

  //Crear un usuario POST(empleado)
  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, userData, { headers: this.getAuthHeaders() });
  
  }

  //Listar usuarios GET (empleados)
  listUsers(page: number = 1, filters: any = {}): Observable<PaginatedResponse> {
    const params: any = { page };
  
    if (filters.name) params.name = filters.name;
    if (filters.identification) params.identification = filters.identification;
  
    return this.http.get<PaginatedResponse>(this.baseUrl, {
      headers: this.getAuthHeaders(),
      params
    }).pipe(
      tap(response => console.log('Respuesta de listUsers:', response)), // Ayuda para depurar
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
    return this.http.get(`${this.baseUrl}${user_id}/`, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error('Error en getUserById:', error);
        return throwError(() => new Error('Error al obtener el usuario.'));
      })
    );
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
  updatePassword(user_id: number, currentPassword: string, newPassword: string): Observable<any>{
    const data = {
      currentPassword: currentPassword,
      newPassword: newPassword
    };
    return this.http.put(`${this.baseUrl}${user_id}/edit-password/`, data, {
      headers: this.getAuthHeaders()
    }).pipe(      
      catchError((error) => {
        console.error('Error al actualizar contraseña:', error);
        return throwError(() => new Error(error?.error?.error || 'Error al cambiar la contraseña'));
      })
    );
  }

  refreshToken(refreshToken: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}token/refresh/`, { refresh: refreshToken });
  }


  logout(){
    // Elimina los tokens del localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
  }
}

// Definir la interfaz `UserResponse`
interface UserResponse {
  items: any[];
}
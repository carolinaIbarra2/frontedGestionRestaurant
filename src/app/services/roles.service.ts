import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { PaginatedResponse } from '../models/pagination-interface';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private baseUrl = 'http://127.0.0.1:8000/api/v1/roles/';
  
  constructor(private http: HttpClient) { }


  
  //Crear un rol POST
  registerRol(rolData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, rolData);
  }

  //listar roles GET
  listRoles(page: number=1): Observable<PaginatedResponse> {
    return this.http.get<PaginatedResponse>(`${this.baseUrl}?page=${page}`)
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


  getRolById(rol_id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}${rol_id}/`);
  }

  //Actualiza roles PUT
  updateRol(rol_id: number, rolData:any): Observable<any>{
    return this.http.put(`${this.baseUrl}${rol_id}/`, rolData);  
  }

  //Eliminar rol DELETE
  deleteRol(rol_id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}${rol_id}/`);
  }
}

// interfaz `RolResponse`
interface RolResponse {
  items: any[];
}

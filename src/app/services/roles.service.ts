import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private baseUrl = 'http://127.0.0.1:8000';
  
  constructor(private http: HttpClient) { }


  //listar roles
  listRoles(): Observable<any> {
    const token = localStorage.getItem('auth_token');  //token desde el almacenamiento local
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`  // Incluye el token en las cabeceras
    });

    return this.http.get(`${this.baseUrl}/roles/list`, { headers });
  }


  // crear un nuevo rol
  createRole(data: any): Observable<any> {
    const token = localStorage.getItem('auth_token');    
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,  // Incluye el token en las cabeceras
      'Content-Type': 'application/json'
    });
    
    return this.http.post(`${this.baseUrl}/roles/create/`, data, { headers });
  }

  // eliminar un rol por id
  deleteRole(roleId: number): Observable<any> {
    const token = localStorage.getItem('auth_token');
    console.log(token)
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,  // Incluye el token en las cabeceras
      'Content-Type': 'application/json'
    });

    return this.http.delete(`${this.baseUrl}/roles/delete/${roleId}/`, { headers });
  }

  

  // Ver detalles de un rol por ID
  getRoleDetails(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/roles/rolesDetail/${id}/`)
  }

  

  // actualizar un rol existente por id
  updateRole(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/roles/roles/${id}/`, data);
  }

  
}

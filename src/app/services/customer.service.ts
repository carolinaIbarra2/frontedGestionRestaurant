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
export class CustomerService {

    private baseUrl = 'http://127.0.0.1:8000/api/v1/customers/';

    constructor(private http: HttpClient, private router: Router) { }

    // Método privado para obtener los headers con autenticación
    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('access_token') || '';
        return new HttpHeaders({
        'Authorization': `Bearer ${token}`,  // Agregar token en el header
        'Content-Type': 'application/json'
        });
    }

    //Crear un usuario POST(empleado)
    registerCustomer(customerData: any): Observable<any> {
        return this.http.post(`${this.baseUrl}`, customerData, { headers: this.getAuthHeaders() });
    
    }

    //Listar usuarios GET (clientes)
  listCustomers(page: number = 1, filters: any = {}): Observable<PaginatedResponse> {
    const params: any = { page };
  
    if (filters.name) params.name = filters.name;
    if (filters.identification) params.identification = filters.identification;
  
    return this.http.get<PaginatedResponse>(this.baseUrl, {
      headers: this.getAuthHeaders(),
      params
    }).pipe(
      tap(response => console.log('Respuesta de listCustomers:', response)), // Ayuda para depurar
      map(response => ({
        items: response.items || [],
        total_pages: response.total_pages,
        current_page: response.current_page,
        total_items: response.total_items
      }))
    );
  }

    // Obtener un cliente por su ID
    getCustomerById(customer_id: number): Observable<any> {
        return this.http.get(`${this.baseUrl}${customer_id}/`, { headers: this.getAuthHeaders() }).pipe(
        catchError((error) => {
            return throwError(() => new Error('Error al obtener el cliente.'));
        })
        );
    }

    //Actualizar usuarios PUT (clientes)
    updateCustomer(customer_id: number, customerData: any): Observable<any>{
        return this.http.put(`${this.baseUrl}${customer_id}/`, customerData, { headers: this.getAuthHeaders() });  
    }

    //Eliminar usuario DELETE (clientes)
    deleteCustomer(customer_id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}${customer_id}/`, { headers: this.getAuthHeaders() });
    }
}
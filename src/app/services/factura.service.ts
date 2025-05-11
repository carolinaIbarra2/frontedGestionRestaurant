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
export class FacturaService {

    private baseUrl = 'http://127.0.0.1:8000/api/v1/factura/';
    private baseUrlCustomer = 'http://127.0.0.1:8000/api/v1/customers/';
    private baseUrlUser = 'http://127.0.0.1:8000/api/v1/users/';
    private baseUrlProduct = 'http://127.0.0.1:8000/api/v1/products/';
    private baseUrlMethodPayment = 'http://127.0.0.1:8000/api/v1/methodPayment/';

    constructor(private http: HttpClient, private router: Router) { }

    // Método privado para obtener los headers con autenticación
    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('access_token') || '';
        return new HttpHeaders({
        'Authorization': `Bearer ${token}`,  // Agregar token en el header
        'Content-Type': 'application/json'
        });
    }    

    //obtener clientes desde el backend
    getCustomer(): Observable<any>{
        return this.http.get<any>(`${this.baseUrlCustomer}`, { headers: this.getAuthHeaders() }).pipe(
          catchError((error) => {
            console.error('Error en getCustomer:', error);
            return throwError(() => new Error('Error al obtener los clientes.'));
          })
       );
    }

    //obtener metodos de pago desde el backend
    getMethodPayment(): Observable<any>{
      return this.http.get<any>(`${this.baseUrlMethodPayment}`, { headers: this.getAuthHeaders() }).pipe(
        catchError((error) => {
          console.error('Error en MethodPayment:', error);
          return throwError(() => new Error('Error al obtener metodos de pago.'));
        })
     );
  }

    //obtener empleados desde el backend
    getUser(): Observable<any>{
        return this.http.get<any>(`${this.baseUrlUser}`, { headers: this.getAuthHeaders() }).pipe(
          catchError((error) => {
            console.error('Error en getUser:', error);
            return throwError(() => new Error('Error al obtener los empleados.'));
          })
       );
    }

    //obtener empleados desde el backend
    getProduct(): Observable<any>{
        return this.http.get<any>(`${this.baseUrlProduct}`, { headers: this.getAuthHeaders() }).pipe(
          catchError((error) => {
            console.error('Error en getProduct:', error);
            return throwError(() => new Error('Error al obtener los productos.'));
          })
       );
    }


    //Crear una factura POST
    registerFactura(facturaData: any): Observable<any> {
        return this.http.post(`${this.baseUrl}`, facturaData, { headers: this.getAuthHeaders() });    
    }


    //Listar usuarios GET (empleados)
    listFactura(page: number = 1, filters: any = {}): Observable<PaginatedResponse> {
        const params: any = { page };
    
        if (filters.consecutive) params.consecutive = filters.consecutive;
        if (filters.table_number) params.table_number = filters.table_number;
    
        return this.http.get<PaginatedResponse>(this.baseUrl, {
        headers: this.getAuthHeaders(),
        params
        }).pipe(
        tap(response => console.log('Respuesta de listFactura:', response)), // Ayuda para depurar
        map(response => ({
            items: response.items || [],
            total_pages: response.total_pages,
            current_page: response.current_page,
            total_items: response.total_items
        }))
        );
    }

    // Obtener una factura por su ID
    getFacturaById(factura_id: number): Observable<any> {
        return this.http.get(`${this.baseUrl}${factura_id}/`, { headers: this.getAuthHeaders() }).pipe(
        catchError((error) => {
            console.error('Error en getFacturaById:', error);
            return throwError(() => new Error('Error al obtener la factura.'));
        })
        );
    }

    //Actualizar factura PUT
    updateFactura(factura_id: number, facturaData: any): Observable<any>{
        return this.http.put(`${this.baseUrl}${factura_id}/`, facturaData, { headers: this.getAuthHeaders() });  
    }

    //Eliminar usuario DELETE (empleados)
    deleteFactura(factura_id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}${factura_id}/`, { headers: this.getAuthHeaders() });
    }

}
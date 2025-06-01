import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedResponse } from 'src/app/models/pagination-interface'
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class PurchaseEntryService {

  private baseUrl = 'http://127.0.0.1:8000/api/v1/purchaseEntry/';
  private baseUrlProduct = 'http://127.0.0.1:8000/api/v1/products/';
  private baseUrlUser = 'http://127.0.0.1:8000/api/v1/users/';

  constructor(private http: HttpClient, private router: Router) { }

    // Método privado para obtener los headers con autenticación
  private getAuthHeaders(): HttpHeaders {
      const token = localStorage.getItem('access_token') || '';
      return new HttpHeaders({
      'Authorization': `Bearer ${token}`,  // Agregar token en el header
      'Content-Type': 'application/json'
      });
  }


  listPurchaseEntry(page: number = 1): Observable<PaginatedResponse> {
    
    return this.http.get<PaginatedResponse>(`${this.baseUrl}?page=${page}`)
      .pipe(
        tap(response => console.log('Respuesta de listPurchaseEntry:', response)), // Depuración
        map(response => ({
          items: response.items || [],
          total_pages: response.total_pages,
          current_page: response.current_page,
          total_items: response.total_items
        }))
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


  getProduct(nameFilter: string = ''): Observable<any>{
    let url = this.baseUrlProduct;

    if (nameFilter) {
      url += `?name=${encodeURIComponent(nameFilter)}`;
    }

    return this.http.get<any>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError((error) => {
        console.error('Error en getProduct:', error);
        return throwError(() => new Error('Error al obtener los productos.'));
      })
    );
  }


  //Crear un registro de compra POST
  registerPurchaseEntry(purchaseEntryData: any): Observable<any> {
      console.log('Registro de venta enviada al backend:', JSON.stringify(purchaseEntryData, null, 2));
      return this.http.post(`${this.baseUrl}`, purchaseEntryData, { headers: this.getAuthHeaders() });    
  }
}
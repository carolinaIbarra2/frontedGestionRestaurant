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



}
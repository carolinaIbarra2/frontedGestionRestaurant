import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { PaginatedResponse } from '../models/pagination-interface';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

    private baseUrl = 'http://127.0.0.1:8000/api/v1/inventory/'

    constructor(private http: HttpClient) { }

    listInventory(page: number=1): Observable<PaginatedResponse> {
        return this.http.get<PaginatedResponse>(`${this.baseUrl}?page=${page}`)
            .pipe(
            tap(response => console.log('Respuesta de listInventory:')), // Depuración
            map(response => ({
                items: response.items || [],
                total_pages: response.total_pages,
                current_page: response.current_page,
                total_items: response.total_items
            }))
            );
    }

    //Actualizar
    updateInventory(product_id: number, inventoryData:any): Observable<any>{
        return this.http.patch(`${this.baseUrl}${product_id}/`, inventoryData);  
    }

}
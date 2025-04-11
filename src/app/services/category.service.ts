import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import { PaginatedResponse } from "../models/pagination-interface";


@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    private baseUrl = 'http://127.0.0.1:8000/api/v1/categories/';

    constructor(private http: HttpClient) {}

    // Método privado para obtener los headers con autenticación
    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token') || '';
        return new HttpHeaders({
            'Authorization': `Token ${token}`,  // Agregar token en el header
            'Content-Type': 'application/json'
        });
    }

    //Crear una categoria POST
    registerCategory(categoryData: any): Observable<any>{
        return this.http.post(`${this.baseUrl}`, categoryData, { headers: this.getAuthHeaders() });
    }

    //listar categorias GET
    listCategory(page: number=1): Observable<PaginatedResponse> {
        return this.http.get<PaginatedResponse>(`${this.baseUrl}?page=${page}`, { headers: this.getAuthHeaders() })
            .pipe(
                tap(response => console.log('Respuesta de listCategorias:')), // Depuración
                map(response => ({
                    items: response.items || [],
                    total_pages: response.total_pages,
                    current_page: response.current_page,
                    total_items: response.total_items
                }))
            );
    }

    getCategoryById(category_id: number): Observable<any> {
        return this.http.get(`${this.baseUrl}${category_id}/`, { headers: this.getAuthHeaders() });
    }

    //Actualizar categorias PUT
    updateCategory(category_id: number): Observable<any> {
        return this.http.put(`${this.baseUrl}${category_id}/`, { headers: this.getAuthHeaders() });
    }

    //Eliminar categoria DELETE
    deleteCategory(category_id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}${category_id}/`, { headers: this.getAuthHeaders() });
    }
}

// interfaz `CategoryResponse`
interface CategoryResponse {
    items: any[];
}
  
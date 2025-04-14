import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import { PaginatedResponse } from "../models/pagination-interface";


@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    private baseUrl = 'http://127.0.0.1:8000/api/v1/categories/';
    private mediaUrl = 'http://127.0.0.1:8000/media/'

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
        const token = localStorage.getItem('token') || '';
        const headers = new HttpHeaders({
            'Authorization': `Token ${token}`
        });

        return this.http.post(`${this.baseUrl}`, categoryData, { headers });
    }

    //listar categorias GET
    listCategory(page: number=1): Observable<PaginatedResponse> {
        return this.http.get<PaginatedResponse>(`${this.baseUrl}?page=${page}`, { headers: this.getAuthHeaders() })
            .pipe(
                map(response => ({
                    items: response.items.map(item => ({
                        ...item,
                        image: item.image ? `${this.mediaUrl}${item.image}` : null
                    })),
                    total_pages: response.total_pages,
                    current_page: response.current_page,
                    total_items: response.total_items
                }))
            );
    }

    getCategoryById(category_id: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}${category_id}/`, { headers: this.getAuthHeaders() })
            .pipe(
                map(category => ({
                    ...category,
                    image: category.image ? `${this.mediaUrl}${category.image}` : null
                }))
            );
    }
    
    

    //Actualizar categorias PUT
    updateCategory(category_id: number, categoryData: any): Observable<any> {
        const token = localStorage.getItem('token') || '';
        const headers = new HttpHeaders({
          'Authorization': `Token ${token}`
          // NO incluyas Content-Type aquí, Angular lo hará automáticamente
        });
      
        return this.http.put(`${this.baseUrl}${category_id}/`, categoryData, { headers });
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
  
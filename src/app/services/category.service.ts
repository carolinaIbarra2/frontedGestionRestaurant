import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { PaginatedResponse } from "../models/pagination-interface";


@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    private baseUrl = 'http://127.0.0.1:8000/api/v1/categories/';
    private mediaUrl = 'http://127.0.0.1:8000/media/'

    constructor(private http: HttpClient) {}

    // Método privado para obtener los headers con autenticación
    private getAuthHeadersJson(): HttpHeaders {
        const token = localStorage.getItem('access_token') || '';
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,  // Agregar token en el header
            'Content-Type': 'application/json'
        });
    }

    // Headers para FormData (no ponemos Content-Type)
    private getAuthHeadersMultipart(): HttpHeaders {
        const token = localStorage.getItem('access_token') || '';
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    //Crear una categoria POST
    registerCategory(categoryData: any): Observable<any>{
        return this.http.post(`${this.baseUrl}`, categoryData, { headers: this.getAuthHeadersMultipart()  });
    }

    //listar categorias GET
    listCategory(page: number=1): Observable<PaginatedResponse> {
        return this.http.get<PaginatedResponse>(`${this.baseUrl}?page=${page}`, { headers: this.getAuthHeadersJson() })
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
        return this.http.get<any>(`${this.baseUrl}${category_id}/`, { headers: this.getAuthHeadersJson() })
            .pipe(
                map(category => ({
                    ...category,
                    image: category.image ? `${this.mediaUrl}${category.image}` : null
                }))
            );
    }
        

    //Actualizar categorias PUT
    updateCategory(category_id: number, categoryData: any): Observable<any> {
        return this.http.put(`${this.baseUrl}${category_id}/`, categoryData, { headers: this.getAuthHeadersMultipart() });
      }
      
      

    //Eliminar categoria DELETE
    deleteCategory(category_id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}${category_id}/`, { headers: this.getAuthHeadersJson() });
    }
}

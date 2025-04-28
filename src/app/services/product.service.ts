import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable, tap } from "rxjs";
import { PaginatedResponse } from "../models/pagination-interface";


@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private baseUrl = 'http://127.0.0.1:8000/api/v1/products/';
    private mediaUrl = 'http://127.0.0.1:8000/media/';
    private baseUrlCategories = 'http://127.0.0.1:8000/api/v1/categories/';

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

   
    getProduct(): Observable<any>{
        return this.http.get<any>(`${this.baseUrlCategories}`, { headers: this.getAuthHeadersJson() });
    }


    //Crear un producto POST
    registerProduct(productData: any): Observable<any>{
        return this.http.post(`${this.baseUrl}`, productData, { headers: this.getAuthHeadersMultipart()  });
    }

    //listar categorias GET
    listProduct(page: number=1): Observable<PaginatedResponse> {
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

    getProductById(product_id: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}${product_id}/`, { headers: this.getAuthHeadersJson() })
            .pipe(
                map(product => ({
                    ...product,
                    image: product.image ? `${this.mediaUrl}${product.image}` : null
                }))
            );
    }


    //Actualizar productos PUT
    updateProduct(product_id: number, productData: any): Observable<any> {
        return this.http.put(`${this.baseUrl}${product_id}/`, productData, { headers: this.getAuthHeadersMultipart() });
    }

    //Eliminar producto DELETE
    deleteProduct(product_id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}${product_id}/`, { headers: this.getAuthHeadersJson() });
    }

    //Obtener categorias desde el backend
    getCategories(params?: any): Observable<any>{
        return this.http.get<any>(`${this.baseUrlCategories}`, { headers: this.getAuthHeadersJson(), params: params});
    }
}

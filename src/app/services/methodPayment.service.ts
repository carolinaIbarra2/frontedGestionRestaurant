import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { PaginatedResponse } from '../models/pagination-interface';

@Injectable({
  providedIn: 'root'
})
export class MethodPaymentService {

    private baseUrl = 'http://127.0.0.1:8000/api/v1/methodPayment/'

    constructor(private http: HttpClient) { }

    //Crear una forma de pago POST
    registerMethodPayment(methodPaymentData: any): Observable<any> {
        return this.http.post(`${this.baseUrl}`, methodPaymentData);
    }

    //listar methodPayment GET
    listMethodPayment(page: number=1): Observable<PaginatedResponse> {
        return this.http.get<PaginatedResponse>(`${this.baseUrl}?page=${page}`)
            .pipe(
            tap(response => console.log('Respuesta de listMethodPayment:')), // Depuración
            map(response => ({
                items: response.items || [],
                total_pages: response.total_pages,
                current_page: response.current_page,
                total_items: response.total_items
            }))
            );
        }

    getMethodPaymentById(methodPayment_id: number): Observable<any> {
        return this.http.get(`${this.baseUrl}${methodPayment_id}/`);
        }

    //Actualiza metodos de pago PUT
    updateMethodPayment(methodPayment_id: number, methodPaymentData:any): Observable<any>{
        return this.http.put(`${this.baseUrl}${methodPayment_id}/`, methodPaymentData);  
    }

    //Eliminar rol DELETE
    deleteMethodPaymentById(methodPayment_id: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}${methodPayment_id}/`);
    }

}
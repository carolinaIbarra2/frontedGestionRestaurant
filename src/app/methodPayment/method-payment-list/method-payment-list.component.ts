import { Component, OnInit } from '@angular/core';
import { MethodPaymentService } from '../../services/methodPayment.service';
import { Router } from '@angular/router';
import { PaginatedResponse } from 'src/app/models/pagination-interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-method-payment-list',
  templateUrl: './method-payment-list.component.html',
  styleUrls: ['./method-payment-list.component.css']
})
export class MethodPaymentListComponent implements OnInit {

  methodPayments: any[] = [];  //lista de metodos de pago
  selectedMethodPayment: any = null;

  totalPages: number = 1;
  currentPage: number = 1;
  pageSize: number = 5; // valor usado por defecto en la paginación del backend

  constructor(private methodPaymentService: MethodPaymentService, private router: Router) {}

  ngOnInit(): void {
      this.getMethodPayments();
  }

  //obtener la lista de metodos de pago desde la api
  getMethodPayments(page: number = 1): void {
    this.methodPaymentService.listMethodPayment(page).subscribe((data: PaginatedResponse) => {
          this.methodPayments = data.items;
          this.totalPages = data.total_pages;
          this.currentPage = data.current_page;
        });
  }

  nextPage() {
    if (this.currentPage < this.totalPages){
      this.getMethodPayments(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.getMethodPayments(this.currentPage - 1);
    }
  }


  //Eliminar metodo de pago con confirmación
  methodPaymentDelete(methodPaymentId: number): void {
    Swal.fire({
          title: '¿Estás seguro de que deseas eliminar esta forma de pago?',
          text: 'Esta acción no se puede deshacer',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar',
          customClass: {
            popup: 'mi-popup',
            title: 'mi-titulo',
            confirmButton: 'mi-boton-confirmar',
            cancelButton: 'mi-boton-cancelar'
          }
        }).then((result) => {
          if (result.isConfirmed) {
            this.methodPaymentService.deleteMethodPaymentById(methodPaymentId).subscribe({
              next: () => {
                this.getMethodPayments(); // Recargar la lista después de eliminar
                Swal.fire({
                  title: '¡Eliminado!',
                  text: 'La forma de pago ha sido eliminada con éxito.',
                  icon: 'success',
                  customClass: {
                    popup: 'mi-popup-success'
                  }
                });
              },
              error: (err) => {
                console.error('Error eliminando forma de pago', err);
                Swal.fire({
                  title: 'Error',
                  text: 'No se pudo eliminar forma de pago',
                  icon: 'error',
                  customClass: {
                    popup: 'mi-popup-error'
                  }
                });
              }
            });
          }
      });
    }

  //Ver detalle del metodo de pago
  seeMethodPaymentDetails(methodPaymentId: number): void{
    this.router.navigate(['/dashboard/methodPayments/detail', methodPaymentId]);
  }
  

}

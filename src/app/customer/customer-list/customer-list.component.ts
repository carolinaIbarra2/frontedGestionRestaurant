import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { PaginatedResponse } from 'src/app/models/pagination-interface'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  customers: any[] = []
  selectedCustomer: any = null;

  totalPages: number = 1;
  currentPage: number = 1;
  pageSize: number = 5;

  constructor(
    private customerService: CustomerService, private router: Router 
  ){}

  ngOnInit(): void {
    this.getCustomers();
  }

  getCustomers(page: number = 1){
    this.customerService.listCustomers(page).subscribe((data: PaginatedResponse) => {
      this.customers = data.items;  // Extraemos solo los usuarios
      this.totalPages = data.total_pages;
      this.currentPage = data.current_page;
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.getCustomers(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.getCustomers(this.currentPage - 1);
    }
  }

  // Eliminar usuario con confirmación
  customerDelete(customerId: number): void {
    Swal.fire({
      title: '¿Estás seguro de que deseas eliminar este cliente?',
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
        this.customerService.deleteCustomer(customerId).subscribe({
          next: () => {
            this.getCustomers(); // Recargar la lista después de eliminar
            Swal.fire({
              title: '¡Eliminado!',
              text: 'El cliente ha sido eliminado con éxito.',
              icon: 'success',
              customClass: {
                popup: 'mi-popup-success'
              }
            });
          },
          error: (err) => {
            console.error('Error eliminando cliente', err);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar el cliente',
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

  //Ver detalle usuario
  seeCustomerDetails(customerId: number): void{
    this.router.navigate(['/dashboard/customers/detail', customerId]);
  }


}

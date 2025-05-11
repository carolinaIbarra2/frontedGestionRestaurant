import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaginatedResponse } from 'src/app/models/pagination-interface';
import { FacturaService } from 'src/app/services/factura.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-factura-list',
  templateUrl: './factura-list.component.html',
  styleUrls: ['./factura-list.component.css']
})
export class FacturaListComponent implements OnInit{

  facturas: any[] = []
  selectedFactura: any = null;

  totalPages: number = 1;
  currentPage: number = 1;
  pageSize: number = 5; // valor usado por defecto en la paginación del backend

  constructor(private facturaService: FacturaService, private router: Router){}

  ngOnInit(): void {
    this.getFacturas();
  }

  // Obtener lista de facturas desde la API
  getFacturas(page: number = 1) {
    this.facturaService.listFactura(page).subscribe((data: PaginatedResponse) => {
      this.facturas = data.items;  
      this.totalPages = data.total_pages;
      this.currentPage = data.current_page;
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.getFacturas(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.getFacturas(this.currentPage - 1);
    }
  }


  // Eliminar factura con confirmación
  facturaDelete(facturaId: number): void {
    Swal.fire({
      title: '¿Estás seguro de que deseas anular esta factura?',
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
        this.facturaService.deleteFactura(facturaId).subscribe({
          next: () => {
            this.getFacturas(); // Recargar la lista después de eliminar
            Swal.fire({
              title: '¡Eliminado!',
              text: 'La factura ha sido eliminada con éxito.',
              icon: 'success',
              customClass: {
                popup: 'mi-popup-success'
              }
            });
          },
          error: (err) => {
            console.error('Error eliminando factura', err);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar la factura',
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
  
    //Ver detalle factura
  seeFacturaDetails(facturaId: number): void{
    this.router.navigate(['/dashboard/facturas/detail', facturaId]);
  }

}

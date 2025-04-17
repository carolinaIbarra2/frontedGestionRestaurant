import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { PaginatedResponse } from 'src/app/models/pagination-interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: any[] = [];
  selectedProduct: any = null;

  totalPages: number = 1;
  currentPage: number = 1;
  pageSize: number = 5; // valor usado por defecto en la paginación del backend

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.getProducts();
  }

  // Obtener lista de usuarios desde la API
  getProducts(page: number = 1) {
      this.productService.listProduct(page).subscribe((data: PaginatedResponse) => {
        this.products = data.items;  // Extraemos solo los usuarios
        this.totalPages = data.total_pages;
        this.currentPage = data.current_page;
      });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.getProducts(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.getProducts(this.currentPage - 1);
    }
  }


  // Eliminar producto con confirmación
    productDelete(productId: number): void {
      Swal.fire({
        title: '¿Estás seguro de que deseas eliminar este producto?',
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
          this.productService.deleteProduct(productId).subscribe({
            next: () => {
              this.getProducts(); // Recargar la lista después de eliminar
              Swal.fire({
                title: '¡Eliminado!',
                text: 'El producto ha sido eliminado con éxito.',
                icon: 'success',
                customClass: {
                  popup: 'mi-popup-success'
                }
              });
            },
            error: (err) => {
              console.error('Error eliminando producto', err);
              Swal.fire({
                title: 'Error',
                text: 'No se pudo eliminar el producto',
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


    //Ver detalle producto
  seeProductDetails(productId: number): void{
    this.router.navigate(['/dashboard/products/detail', productId]);
  }

}

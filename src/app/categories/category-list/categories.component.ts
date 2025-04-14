import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaginatedResponse } from 'src/app/models/pagination-interface';
import { CategoryService } from 'src/app/services/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  categories: any[] = [];
  selectedCategory: any = null;
  
  totalPages: number = 1;
  currentPage: number = 1;
  pageSize: number = 5; // valor usado por defecto en la paginación del backend


  constructor(private categoryService: CategoryService, private router: Router){}

  ngOnInit(): void {
      this.getCategories(); //Cargar las categorias al inicializar el componente
  }

  //obtener la lista de categorias desde la api
  getCategories(page: number = 1): void {
    this.categoryService.listCategory(page).subscribe((data: PaginatedResponse) => {
      this.categories = data.items;
      this.totalPages = data.total_pages;
      this.currentPage = data.current_page;
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.getCategories(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.getCategories(this.currentPage - 1);
    }
  }

  //Eliminar caategoria con confirmación
    categoryDelete(categoryId: number): void {
      Swal.fire({
            title: '¿Estás seguro de que deseas eliminar esta categoria?',
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
              this.categoryService.deleteCategory(categoryId).subscribe({
                next: () => {
                  this.getCategories(); // Recargar la lista después de eliminar
                  Swal.fire({
                    title: '¡Eliminado!',
                    text: 'La categoria ha sido eliminada con éxito.',
                    icon: 'success',
                    customClass: {
                      popup: 'mi-popup-success'
                    }
                  });
                },
                error: (err) => {
                  console.error('Error eliminando categoria', err);
                  Swal.fire({
                    title: 'Error',
                    text: 'No se pudo eliminar la categoria',
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

  //Ver detalle del rol
  seeCategoryDetails(categoryId: number): void{
    this.router.navigate(['/dashboard/categories/detail', categoryId]);
  }      

}

import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../services/roles.service';
import { Router } from '@angular/router';
import { PaginatedResponse } from 'src/app/models/pagination-interface'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  roles: any[] = [];   //lista de roles
  selectedRol: any = null;

  totalPages: number = 1;
  currentPage: number = 1;

  constructor(private rolesService: RolesService, private router: Router) {}

  ngOnInit(): void {
      this.getRoles();   //cargar los roles al inicializar el componente
  }


  //obtener la lista de roles desde la api
  getRoles(page: number = 1): void {
    this.rolesService.listRoles(page).subscribe((data: PaginatedResponse) => {
      this.roles = data.items;
      this.totalPages = data.total_pages;
      this.currentPage = data.current_page;
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages){
      this.getRoles(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.getRoles(this.currentPage - 1);
    }
  }

  //Eliminar rol con confirmación
  rolDelete(rolId: number): void {
    Swal.fire({
          title: '¿Estás seguro de que deseas eliminar este rol?',
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
            this.rolesService.deleteRol(rolId).subscribe({
              next: () => {
                this.getRoles(); // Recargar la lista después de eliminar
                Swal.fire({
                  title: '¡Eliminado!',
                  text: 'El rol ha sido eliminado con éxito.',
                  icon: 'success',
                  customClass: {
                    popup: 'mi-popup-success'
                  }
                });
              },
              error: (err) => {
                console.error('Error eliminando rol', err);
                Swal.fire({
                  title: 'Error',
                  text: 'No se pudo eliminar el rol',
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
  seeRolDetails(rolId: number): void{
    this.router.navigate(['/dashboard/roles/detail', rolId]);
  }

}

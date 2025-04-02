import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { PaginatedResponse } from 'src/app/models/pagination-interface'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: any[] = []   //Lista de usuarios
  selectedUser: any = null;

  totalPages: number = 1;
  currentPage: number = 1;

  constructor(
    private userService: UserService, private router: Router
  ){}

  ngOnInit(): void {
    this.getUsers();
  }

  // Obtener lista de usuarios desde la API
  getUsers(page: number = 1) {
    this.userService.listUsers(page).subscribe((data: PaginatedResponse) => {
      this.users = data.items;  // Extraemos solo los usuarios
      this.totalPages = data.total_pages;
      this.currentPage = data.current_page;
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.getUsers(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.getUsers(this.currentPage - 1);
    }
  }


  // Método para verificar si el usuario es admin
  checkIfAdmin(): boolean {
    // Aquí deberías obtener el rol del usuario autenticado
    const userRole = localStorage.getItem('userRole'); // Solo como ejemplo
    return userRole === 'admin';
  }

  // Eliminar usuario con confirmación
  userDelete(userId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.getUsers(); // Recargar la lista después de eliminar
        },
        error: (err) => {
          console.error('Error eliminando usuario', err);
        }
      });
    }
  }

  //Ver detalle usuario
  seeUserDetails(userId: number): void{
    this.router.navigate(['/dashboard/users/detail', userId]);
  }
}
 
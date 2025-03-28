import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: any[] = []   //Lista de usuarios
  isAdmin: boolean = false;

  constructor(
    private userService: UserService, private router: Router
  ){}

  ngOnInit(): void {
    this.userService.listUsers().subscribe({
      next: (data) => {
        this.users = data; // Ya es un array, sin errores en *ngFor
        console.log('Usuarios cargados:', this.users);
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    });
    this.isAdmin = this.checkIfAdmin(); // Lógica para verificar si es admin
  }

  // Obtener lista de usuarios desde la API
  getUsers(): void {
    this.userService.listUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error cargando usuarios', err);
      }
    });
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


  userEdit(userId: number): void{
    this.router.navigate([`/dashboard/users/editar/${userId}`]);
  }

  seeUserDetails(userId: number): void{

  }
}
 
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  user: any = null;
  isEditing: boolean = false; 
  roles: any[] = [];  //Lista de roles disponibles

  constructor(private userService: UserService, private route: ActivatedRoute) {}

  ngOnInit(): void {

    this.loadRoles(); // Primero carga los roles disponibles

    const userId = Number(this.route.snapshot.paramMap.get('id'));
    if (userId) {
      this.userService.getUserById(userId).subscribe(
        data => {
          this.user = data;

          const rolId = this.user.roles?.role_ids || [];  //role_ids , nombre de variable como retorna el backend
          const rolName = this.user.roles?.names || [];
          
          this.user.roles = rolId.map((id: number, index: number) => ({
            id,
            name: rolName[index]
          }));
          console.log('Usuario con roles formateados:', this.user);
        },
        error => {
          console.error('Error al obtener usuario:', error);
        }
      );
    }      
  }

  edit(): void {
    this.isEditing = !this.isEditing;

    if (!this.isEditing && this.user && this.user.id) {
      this.userService.updateUser(this.user.id, { roles: this.user.roles }).subscribe(
        (response: any) => {
          console.log('Roles actualizados:', response);
        },
        (error: any) => {
          console.error('Error al actualizar roles:', error);
        }
      );
    }
  }

  loadRoles(): void {
    this.userService.getRoles().subscribe({
      next: (data) => {
        this.roles = data.items;
      },
      error: (err) => {
        console.error('Error cargando roles:', err);
      }
    });
  }

  toggleRole(roleId: number): void {
    const index = this.user.roles.findIndex((role: any) => role.id === roleId);
    if (index > -1) {
      this.user.roles.splice(index, 1);
    } else {
      const selectedRole = this.roles.find(role => role.id === roleId);
      if (selectedRole) {
        this.user.roles.push(selectedRole); // Agregar el objeto completo
      }
    }
  }
  

  isRoleSelected(roleId: number): boolean {
    return Array.isArray(this.user?.roles) && this.user.roles.some((userRole: any) => userRole.id === roleId);
  }
  

  get userRolesText(): string {
    return Array.isArray(this.user?.roles) && this.user.roles.length
      ? this.user.roles.map((role: any) => role.name).join(', ')
      : 'Sin roles';
  }
  
}

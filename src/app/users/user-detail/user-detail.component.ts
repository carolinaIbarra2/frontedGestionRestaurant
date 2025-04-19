import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  user: any = null;
  isEditing: boolean = false; 
  roles: any[] = [];  //Lista de roles disponibles
  errorMessage: string = '';

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
      this.userService.updateUser(this.user.id, { 
        name: this.user.name,
        last_name: this.user.last_name,
        email: this.user.email,
        identification: this.user.identification,
        phone_number: this.user.phone_number,
        address: this.user.address,
        is_active: this.user.is_active,
        password: this.user.password,
        roles: this.user.roles.map((r: any) => r.id)  }).subscribe({
          next: () => {},
          error: (err) => {
            if (err.error && err.error.error) {
              this.errorMessage = err.error.error; // <-- mensaje del backend
            } else {
              this.errorMessage = 'Error en el registro. Verifique los datos.';
            }
          }
        });
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

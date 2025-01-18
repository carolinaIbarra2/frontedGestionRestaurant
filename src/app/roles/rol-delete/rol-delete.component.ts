import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../services/roles.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-rol-delete',
  template: '' ,
  styleUrls: []
})
export class RolDeleteComponent implements OnInit {

  roleId!: number;   //variable para almacenar el id del rol

  constructor(private rolesService: RolesService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
      // recuperar el id del rol de la url
      this.roleId = +this.route.snapshot.paramMap.get('id')!;
      this.deleteRole();
  }

  deleteRole() {
    if (confirm('¿Estás seguro de que deseas eliminar este rol?')) {
      this.rolesService.deleteRole(this.roleId).subscribe(
        () => {
          this.router.navigate(['/dashboard/roles']);
          alert('Rol eliminado con éxito.');          
        },
        (error) => {
          console.error('Error al eliminar el rol:', error);
          alert('Hubo un problema al eliminar el rol.');
          this.router.navigate(['/dashboard/roles']);
        }
      );
    } else {
      this.router.navigate(['/dashboard/roles']);
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../services/roles.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-rol-detail',
  templateUrl: './rol-detail.component.html',
  styleUrls: ['./rol-detail.component.css']
})
export class RolDetailComponent implements OnInit {

  rol: any = null;
  isEditing: boolean = false;

  constructor(private rolesService: RolesService, private route: ActivatedRoute) {}

  ngOnInit(): void {
      
    const rolId = Number(this.route.snapshot.paramMap.get('id'));
    if (rolId) {
      this.rolesService.getRolById(rolId).subscribe(
        data => {
          this.rol = data;
          const rolName = this.rol.roles?.names || [];          
        },
        error => {
          console.error('Error al obtener el rol;', error);
        }
      );
    }
  }

  edit(): void {
    this.isEditing = !this.isEditing;

    if(!this.isEditing && this.rol && this.rol.id) {
      this.rolesService.updateRol(this.rol.id).subscribe(
        (response: any) => {
          console.log('Roles actualizados')
        },
        (error: any) => {
          console.error('Error al actualizar roles')
        }
      );
    }
  }
}

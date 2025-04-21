import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../services/roles.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-rol-detail',
  templateUrl: './rol-detail.component.html',
  styleUrls: ['./rol-detail.component.css']
})
export class RolDetailComponent implements OnInit {

  rol: any = null;
  isEditing: boolean = false;
  errorMessage: string = '';

  constructor(private rolesService: RolesService, private route: ActivatedRoute) {}

  ngOnInit(): void {
      
    const rolId = Number(this.route.snapshot.paramMap.get('id'));
    if (rolId) {
      this.rolesService.getRolById(rolId).subscribe(
        data => {
          this.rol = data;       
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
      this.rolesService.updateRol(this.rol.id, {
        name: this.rol.name,
        is_active: this.rol.is_active }).subscribe({
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
}

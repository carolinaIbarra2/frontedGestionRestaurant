import { Component, OnInit } from '@angular/core';
import { RolesService } from '../../services/roles.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  roles: any[] = [];   //lista de roles

  constructor(private rolesService: RolesService) {}

  ngOnInit(): void {
      this.getRoles();   //cargar los roles al inicializar el componente
  }


  //obtener la lista de roles
  getRoles(): void {
    this.rolesService.listRoles().subscribe(
      (data) => {
        this.roles = data.roles;},
      (error) => {console.error('Error al obtener roles:', error);}
    );
  }
}

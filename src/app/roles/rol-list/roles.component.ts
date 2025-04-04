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
  getRoles(): void {
    this.rolesService.listRoles().subscribe(
      (data) => {
        this.roles = data.roles;},
      (error) => {console.error('Error al obtener roles:', error);}
    );
  }
}

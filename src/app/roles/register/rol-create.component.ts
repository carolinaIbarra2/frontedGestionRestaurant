import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RolesService } from '../../services/roles.service';

@Component({
  selector: 'app-rol-create',
  templateUrl: './rol-create.component.html',
  styleUrls: ['./rol-create.component.css']
})
export class RolCreateComponent {
  
  roleForm = this.fb.group({
    name: ['', Validators.required]
  });

  message: string | null = null;
  messageClass: string = '';

  constructor(private fb: FormBuilder, private rolesService: RolesService){}

  createRole() {
    if (this.roleForm.valid) {
      this.rolesService.createRole(this.roleForm.value).subscribe(
        (response) => {
          this.message = 'Rol creado con éxito';
          this.messageClass = 'success';
          setTimeout(() => this.clearMessage(), 3000);
        },
        (error) => {
          this.message = error.status === 401
            ? 'Usuario no autorizado'
            : 'Ocurrio un error al crear el rol';
          this.messageClass = 'error';
          setTimeout(() => this.clearMessage(), 3000);
        }
      );
    }
  }

  clearMessage() {
    this.message = null;
  }
}
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  registerForm: FormGroup;
  errorMessage: string = '';
  roles: any[] = [];  //Lista de roles disponibles

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      identification: ['', [Validators.required]],
      phone_number: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.maxLength(15)]],
      address: ['', [Validators.required]],
      roles: [[], Validators.required],
      is_active: [false]
    });
  }

  ngOnInit(): void {
      
    this.loadRoles();   //obtener la lista de roles
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const userData = this.registerForm.value;

      userData.is_active = !!userData.is_active; //convertir a booleano

      // Enviar datos al backend
      this.userService.registerUser(userData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/users']);
        },
        error: (err) => {
          if (err.error && err.error.error) {
            this.errorMessage = err.error.error; // <-- mensaje del backend
          } else {
            this.errorMessage = 'Error en el registro. Verifique los datos.';
          }
        }
        
        });

      } else {
        this.errorMessage = 'Formulario inválido. Revise los campos.';
    }
  }

  onRoleChange(event: any, roleId: number): void {
    const selectedRoles = this.registerForm.value.roles || [];
    if (event.target.checked) {
      // Si se seleccionó la casilla, agregamos el rol al array
      this.registerForm.patchValue({
        roles: [...selectedRoles, roleId]
      });
    } else {
      // Si se desmarcó la casilla, eliminamos el rol del array
      this.registerForm.patchValue({
        roles: selectedRoles.filter((id: number) => id !== roleId)
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

}
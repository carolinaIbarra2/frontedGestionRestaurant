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
  isAdmin: boolean = false; //variable para verificar si el usuario  es adminitrador

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
      is_staff: [false],
      is_active: [true],
      is_superuser: [false]
    });
  }

  ngOnInit(): void {
    // Obtener token almacenado
    this.getUserInfo();  // Obtiene información del usuario y roles
    this.loadRoles();   //obtener la lista de roles
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const userData = this.registerForm.value;

      // Si no es administrador, aseguramos que is_staff e is_superuser sean falsos
      if(!this.isAdmin){
        userData.is_staff = false;
        userData.is_superuser = false;
      }

      // Enviar datos al backend
      this.userService.registerUser(userData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Error en el registro', err);
          this.errorMessage = 'Error en el registro. Verifique los datos.';
          }
        });

      } else {
        this.errorMessage = 'Formulario inválido. Revise los campos.';
    }
  }


  getUserInfo(): void {
    // Obtener token almacenado
    const token = localStorage.getItem('auth_token');

    if (token) {
      try {
        // Decodificar token JWT
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.isAdmin = payload.is_superuser || false;
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        this.isAdmin = false;
      }
    }
  }


  loadRoles(): void {
    this.userService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (err) => {
        console.error('Error cargando roles:', err);
      }
    });
  }

}
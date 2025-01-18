import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm: FormGroup;
  //roles: Role[] = []; // Cambia el tipo de roles a 
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      identification: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
      address: ['', [Validators.required]],
      is_staff: [false],
      is_active: [true],
      roles: [[], [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Llamo a la API para obtener los roles disponibles
    this.http.get<any[]>(`${environment.apiBaseUrl}/roles/`).subscribe(
 //     roles => this.roles = roles,
      error => this.errorMessage = 'Error al cargar los roles'
    );
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      const token = localStorage.getItem('auth_token');

      if (token) {
        const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
        const userData = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          last_name: formData.last_name,
          identification: formData.identification,
          phone_number: formData.phone_number,
          address: formData.address,
          is_staff: formData.is_staff,
          is_active: formData.is_active,
          roles: formData.roles
        };

        this.http.post(`${environment.apiBaseUrl}/users/create/`, userData, { headers }).subscribe(
          response => {
            this.router.navigate(['/login']);  // Redirigir al login
          },
          error => {
            this.errorMessage = error.error.detail || 'Error al registrar el usuario';
          }
        );
      } else {
        this.errorMessage = 'No se encontró el token de autenticación';
      }
    }
  }
}
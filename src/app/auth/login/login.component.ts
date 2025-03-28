import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm : FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid){
    const { email, password } = this.loginForm.value;

    //Llama al servicio de autenticación
    this.userService.login(email, password).subscribe({
      next: (response) => {
        const token = response?.token;

      if (token) {
        // Guardar el token en el almacenamiento local o de sesión
        localStorage.setItem('auth_token', token);

        // Redirigir al dashboard
        this.router.navigate(['/dashboard']);
        
      } else {
        console.error('Token no recibido en la respuesta');
      }
      },
      error: (err) => {
        //mensaje para errores
        this.errorMessage = 'Correo o contraseña incorrectos';
      }
    });   

    } else {
      this.errorMessage = 'Por favor, diligenciar todos los campos'
    }
  }

}

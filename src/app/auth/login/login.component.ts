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
        const token = response?.access_token;
        const refreshToken = response?.refresh_token;
        

        if (token && refreshToken) {
          localStorage.setItem('access_token', token);
          localStorage.setItem('refresh_token', refreshToken);

          const user = {
            id: response.user_id,
            email: response.email
          };
          localStorage.setItem('user', JSON.stringify(user));  // Guarda usuario
            
          this.router.navigate(['/dashboard']);
        } else {
          console.error('Tokens no recibidos en la respuesta');
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

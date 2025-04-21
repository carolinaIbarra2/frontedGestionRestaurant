import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RolesService } from '../../services/roles.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private rolService: RolesService, private router: Router){
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      is_active: [false]
    });
  }

  ngOnInit(): void {
      
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const rolData = this.registerForm.value;

      //Enviar datos al backend
      this.rolService.registerRol(rolData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/roles']);
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
      this.errorMessage = 'Formulario inválido. Revise los campos.'
    }    
  }

}
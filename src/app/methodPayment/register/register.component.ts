import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MethodPaymentService } from 'src/app/services/methodPayment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  errorMessage: string = '';

  constructor( private fb: FormBuilder, private methodPaymentService: MethodPaymentService, private router: Router ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      is_active: [false]
    });
  }

  ngOnInit(): void {
      
  }

  onSubmit(): void {
    if (this.registerForm.valid){
      const methodPaymentData = this.registerForm.value;

      //enviar datos al backend
      this.methodPaymentService.registerMethodPayment(methodPaymentData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/methodPayments']);
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
      this.errorMessage = 'Formulario inválido. Revise los campos.Formulario inválido. Revise los campos.'
    }
  }

}

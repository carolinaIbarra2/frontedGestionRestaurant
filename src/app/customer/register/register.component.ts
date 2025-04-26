import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private customerService: CustomerService, private router: Router) {
      this.registerForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        name: ['', [Validators.required]],
        last_name: ['', [Validators.required]],
        identification: ['', [Validators.required]],
        phone_number: ['', [Validators.required, Validators.pattern('[0-9]+'), Validators.maxLength(15)]],
        address: ['', [Validators.required]]
      });
    }
  
    ngOnInit(): void {}

    onSubmit(): void {
      if (this.registerForm.valid) {
        const customerData = this.registerForm.value;
  
        // Enviar datos al backend
        this.customerService.registerCustomer(customerData).subscribe({
          next: () => {
            this.router.navigate(['/dashboard/customers']);
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





}

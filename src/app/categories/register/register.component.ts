import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  errorMessage: string = '';
  selectedImage: File | null = null;

  constructor(private fb: FormBuilder, private categoryService: CategoryService, private router: Router){
      this.registerForm = this.fb.group({
        name: ['', Validators.required],
        code: [''],
        image: [null],
        is_active: [true]
      });
    }

    ngOnInit(): void {

    }

    // Captura la imagen al seleccionar archivo
    onImageSelected(event: any): void {
      const file = event.target.files[0];
      if (file) {
        this.selectedImage = file;
      }
    }

    onSubmit(): void {
      if (this.registerForm.valid) {       
        const formData = new FormData();

        formData.append('name', this.registerForm.get('name')?.value);
        formData.append('code', this.registerForm.get('code')?.value || '');
        formData.append('is_active', this.registerForm.get('is_active')?.value ? 'true' : 'false');

        if (this.selectedImage) {
          formData.append('image', this.selectedImage);
        }

        //Enviar datos al backend
        this.categoryService.registerCategory(formData).subscribe({
          next: () => {
            this.router.navigate(['/dashboard/categories']);
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

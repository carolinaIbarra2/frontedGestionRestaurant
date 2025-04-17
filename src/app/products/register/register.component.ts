import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
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
  categories: any[] = []; 
  
  constructor(private fb: FormBuilder, private productService: ProductService, private router: Router){
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      description: [''],
      price: [0],
      image: [null],
      is_active: [true]
    });
  }

  ngOnInit(): void {

    this.loadCategories();  //obtener la lista de categorias
      
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
      formData.append('category', this.registerForm.get('category')?.value);
      formData.append('description', this.registerForm.get('description')?.value);
      formData.append('price', this.registerForm.get('price')?.value);
      formData.append('is_active', this.registerForm.get('is_active')?.value ? 'true' : 'false');

      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }
      console.log('Categoría:', formData.get('category'));
      console.log('Tipo de dato de categoría:', typeof formData.get('category'));


      //Enviar datos al backend
      this.productService.registerProduct(formData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/products']);
        },
        error: (err) => {
          this.errorMessage = 'Error en el registro. Verifique los datos.';
        }
      });

    } else {
      this.errorMessage = 'Formulario inválido. Revise los campos.'
    }
  }


  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data) => {
        this.categories = data.items;
      },
      error: (err) => {
        console.error('Error cargando categorias:', err);
      }
    });
  }

}

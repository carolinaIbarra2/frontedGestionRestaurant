import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PurchaseEntryService } from '../../services/purchaseEntry.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm: FormGroup;
  errorMessage: string = '';
  productLoading: boolean = false;
  productErrorMessage: string = ''; 
  productFound: any | null = null;
  productSearchTerm: string = '';
  user: any = null;

  constructor(private fb: FormBuilder, private purchaseEntryService: PurchaseEntryService, private router: Router ) {
    this.registerForm = this.fb.group({
      supplier: ['', Validators.required],
      observations: [''],
      products: this.fb.array([]),
      productSearchTerm: ['']
    });
  }

  ngOnInit(): void {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
      }
  }

  get products(): FormArray {
      return this.registerForm.get('products') as FormArray;
  }

  addProduct(): void {
      const productForm = this.fb.group({
        name: ['', Validators.required],
        quantity: [0, Validators.required],
      });
  
      this.products.push(productForm);
  }

  removeProduct(index: number): void {
    this.products.removeAt(index);
  }
  
  onSubmit(): void {
    if (this.registerForm.valid) {

      if (this.products.length === 0) {
        this.errorMessage = 'Debe agregar al menos un producto.';
        return;
      }

      // Obtener los productos y limpiarlos para que solo incluyan los campos necesarios
    const productos = this.products.getRawValue().map((prod: any) => ({
      product: prod.product,  // debe ser el ID del producto
      quantity: prod.quantity,
    }));

    // Construcción del objeto que espera el backend
    const purchaseEntryData = {
      supplier: this.registerForm.get('supplier')?.value,
      observations: this.registerForm.get('observations')?.value,
      user: this.user.id,
      products: productos,
    };
          
      //Enviar datos al backend
      this.purchaseEntryService.registerPurchaseEntry(purchaseEntryData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/purchaseEntry']);
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


  searchProduct() {
    this.productLoading = true;
    this.productErrorMessage = '';
    this.productFound = null;

    const name = this.registerForm.get('productSearchTerm')?.value.trim();

    if (!name) {
      this.productErrorMessage = 'Ingrese un nombre para buscar';
      this.productLoading = false;
      return;
    }

    this.purchaseEntryService.getProduct(name).subscribe({
      next: (data) => {
        const products = data.items || [];
        const matchedProduct = products.find((p: any) => p.name.toLowerCase() === name.toLowerCase());

        if (matchedProduct) {
          this.productFound = matchedProduct;
          this.addProductFromSearch();
        } else {
          this.productFound = false;
          this.productErrorMessage = 'Producto no encontrado';
        }
        this.productLoading = false;
      },
      error: (err) => {
        console.error('Error al buscar producto:', err);
        this.productErrorMessage = 'Error al buscar producto';
        this.productLoading = false;
      }
    });
  }


  addProductFromSearch(): void {
    if (this.productFound) {
      const precio = Number(this.productFound.price) || 0;
      const quantity = 0;

      const productForm = this.fb.group({
        product: [this.productFound.id || '', Validators.required],
        name: [this.productFound.name || '', Validators.required],
        quantity: [0, Validators.required],
      });

      this.products.push(productForm);
      this.productFound = null;
      this.registerForm.get('productSearchTerm')?.reset();
    }
  }




}

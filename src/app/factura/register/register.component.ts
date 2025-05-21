import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { FacturaService } from '../../services/factura.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  errorMessage: string = '';
  methodPayments: any[] = [];
  table_numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  factura: any = null;
  user: any = null;
  customers: any[] = [];
  selectedClient: number | null = null;
  loadingCustomers: boolean = false;
  identificationFilter: string = '';
  customerFound: boolean | null = null;
  private clienteIdEncontrado: number | null = null;
  productLoading: boolean = false;
  productErrorMessage: string = ''; 
  productFound: any | null = null;
  productSearchTerm: string = '';
  nextConsecutivo: number | null = null;
  prefix = 'FAC';

  constructor(private fb: FormBuilder, private facturaService: FacturaService, private router: Router){
      this.registerForm = this.fb.group({
        prefix: ['FAC'],
        table_number: [1, Validators.required],
        methodPayment: ['', Validators.required],
        customer: ['', Validators.required],
        is_active: [true],
        products: this.fb.array([]),
        productSearchTerm: ['']
      });
  }

  ngOnInit(): void {
      this.loadMethodPayments();
      this.searchConsecutive();

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
      description: [''],
      precio_unitario: [0, [Validators.required, Validators.min(0)]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      subtotal: [{ value: 0, disabled: true }]
    });

    this.products.push(productForm);
  }

  removeProduct(index: number): void {
    this.products.removeAt(index);
  }

  updateSubtotal(index: number): void {
    const product = this.products.at(index);
    const precio = Number(product.get('precio_unitario')?.value) || 0;
    const cantidad = Number(product.get('cantidad')?.value) || 0;
    const subtotal = precio * cantidad;
    product.get('subtotal')?.setValue(subtotal);
  }

  getTotal(): number {
    return this.products.controls.reduce((totalAcumulado, product) => {
      const subtotal = product.get('subtotal')?.value || 0;
      return totalAcumulado + subtotal;
    }, 0);
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
      cantidad: prod.cantidad,
      precio_unitario: prod.precio_unitario,
      subtotal: prod.subtotal,
    }));

    // Construcción del objeto que espera el backend
    const facturaData = {
      prefix: this.registerForm.get('prefix')?.value,
      consecutive: this.nextConsecutivo,
      table_number: this.registerForm.get('table_number')?.value,
      customer: this.clienteIdEncontrado,
      user: this.user.id,
      methodPayments: [this.registerForm.get('methodPayment')?.value], // debe ser array
      products: productos,
      value: this.getTotal(),
      estado: 'activa', // lo puedes ajustar según necesidad
    };
          
      //Enviar datos al backend
      this.facturaService.registerFactura(facturaData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard/facturas']);
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


  loadMethodPayments(): void {
    let allMethodPayments: any[] = [];
    let page = 1;

    const loadPage = () => {
      this.facturaService.getMethodPayment({ page: page,  page_size:20 }).subscribe({
        next: (data) => {
          allMethodPayments = allMethodPayments.concat(data.items);
          if (data.next) {
            page++;
            loadPage();
          } else {
            this.methodPayments = allMethodPayments;

            if (this.methodPayments.length > 0) {
              this.registerForm.get('methodPayment')?.setValue(this.methodPayments[0].id);
            }
          }
        },
        error: (err) => {
          console.error('Error cargando metodos de pago:', err);
        }
      });
    };
  
    loadPage();

  }
  

  searchCustomers(): void {

    this.loadingCustomers = true;
    this.errorMessage = '';

    const identification = this.registerForm.get('customer')?.value;

    this.facturaService.getCustomer(identification).subscribe({
      next: (data) => {
        const customers = data.items || [];
        const matchedCustomer = customers.find((c: any) => c.identification === identification);

        if (matchedCustomer) {
          this.clienteIdEncontrado = matchedCustomer.id;
          this.customerFound = true;
        } else {
          this.clienteIdEncontrado = null;
          this.customerFound = false;
        }
        this.loadingCustomers = false;
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
        this.loadingCustomers = false;
      }
    });
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

    this.facturaService.getProduct(name).subscribe({
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
      const cantidad = 1;
      const subtotal = precio * cantidad;

      const productForm = this.fb.group({
        product: [this.productFound.id || '', Validators.required],
        name: [this.productFound.name || '', Validators.required],
        description: [this.productFound.description || ''],
        precio_unitario: [precio, [Validators.required, Validators.min(0)]],
        cantidad: [1, [Validators.required, Validators.min(1)]],
        subtotal: [{ value: subtotal, disabled: true }]

      });

      this.products.push(productForm);
      this.updateSubtotal(this.products.length - 1);
      productForm.get('cantidad')?.valueChanges.subscribe(() => {
      this.updateSubtotal(this.products.length - 1);
      });

      productForm.get('precio_unitario')?.valueChanges.subscribe(() => {
        this.updateSubtotal(this.products.length - 1);
      });

      this.productFound = null;
      this.registerForm.get('productSearchTerm')?.reset();
    }
  }


  searchConsecutive(): void {
    this.facturaService.getNextConsecutivo(this.prefix).subscribe({
      next: (response) => {
        this.nextConsecutivo = response.next_consecutive;
      },
      error: (error) => {
        console.error('Error al obtener el consecutivo:', error);
      }
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { FacturaService } from '../../services/factura.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-factuta-detail',
  templateUrl: './factuta-detail.component.html',
  styleUrls: ['./factuta-detail.component.css']
})
export class FactutaDetailComponent implements OnInit {
  factura: any = null;
  isEditing: boolean = false; 
  methodPayments: any[] = []; 
  table_numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  errorMessage: string = '';
  successMessage: string = '';
  formFactura!: FormGroup;


  constructor(private facturaService: FacturaService, private route: ActivatedRoute, private fb: FormBuilder,private router: Router) {}

  ngOnInit(): void {

    this.loadMethodPayment(); // Primero carga los roles disponibles
    
    const facturaId = Number(this.route.snapshot.paramMap.get('id'));
    if (facturaId) {
      this.facturaService.getFacturaById(facturaId).subscribe(
        data => {
          this.factura = data;
        },
        error => {
          this.errorMessage = 'No se pudo cargar la factura.';
        }
      );
    }      
  }

  loadMethodPayment(): void {
    this.facturaService.getMethodPayment().subscribe({
      next: (data) => {
        this.methodPayments = data.items;
      },
      error: (err) => {
        console.error('Error cargando metodos de pago:', err);
      }
    });
  }

  


  edit(): void {
    this.isEditing = !this.isEditing;

    if (this.isEditing && this.factura) {
    // Inicializar el formulario con los valores actuales de la factura
      this.formFactura = this.fb.group({
        table_number: [this.factura.table_number],
        methodPayment: [this.factura.method_payments?.[0]?.id || ''] // toma el primero si existe
      });
    }
   
    // Al guardar los cambios
    if (!this.isEditing && this.factura && this.factura.id && this.formFactura) {
      const formValues = this.formFactura.value;

      this.factura.table_number = formValues.table_number;
      
      // Solo 1 método de pago en este ejemplo
      const selectedMethod = this.methodPayments.find(m => m.id === Number(formValues.methodPayment));
      this.factura.methodPayments  = selectedMethod ? [selectedMethod] : [];

      const payload = {
        prefix: this.factura.prefix,
        consecutive: this.factura.consecutive,
        value: this.factura.value,
        table_number: this.factura.table_number,
        customer: this.factura.customer.id || this.factura.customer,  // Solo ID del cliente
        estado: this.factura.estado,
        products: (this.factura.products || []).map((p: any) => ({
          product: p.id,
          cantidad: p.cantidad,
          precio_unitario: p.precio_unitario,
          subtotal: p.subtotal
        })),
        user: this.factura.user.id || this.factura.user,  // solo ID usuario
        methodPayments: this.factura.methodPayments.map((m: any) => m.id),  // arreglo de IDs
      };


      this.facturaService.updateFactura(this.factura.id, payload).subscribe(
        () => {
          this.successMessage = '✅ La factura se actualizó correctamente.';
          setTimeout(() => {
            this.successMessage = '';
            this.router.navigate(['/dashboard/facturas']);
          }, 2000); 
        },
        error => {
          this.errorMessage = '❌ Ocurrió un error al actualizar la factura.';
        }
      );
    }
  }

  get facturaMethodPaymentText(): string {
    return Array.isArray(this.factura?.method_payments) && this.factura.method_payments.length
      ? this.factura.method_payments.map((methodPayment: any) => methodPayment.name).join(', ')
      : 'Sin métodos de pago';
  }
  
  toggleMethodPayment(methodPaymentId: number): void {
    const index = this.factura.methodPayments.findIndex((methodPayment: any) => methodPayment.id === methodPaymentId);
    if (index > -1) {
      this.factura.methodPayments.splice(index, 1);
    } else {
      const selectedMethodPayment = this.methodPayments.find(methodPayment => methodPayment.id === methodPaymentId);
      if (selectedMethodPayment) {
        this.factura.methodPayment.push(selectedMethodPayment); // Agregar el objeto completo
      }
    }
  }

  isMethodPaymentSelected(methodPaymentId: number): boolean {
    return Array.isArray(this.factura?.methodPayments) && this.factura.methodPayments.some((facturaMethodPayment: any) => facturaMethodPayment.id === methodPaymentId);
  }

  get facturaUserText(): string {
    return Array.isArray(this.factura?.user) && this.factura.user.length
      ? this.factura.user.map((user: any) => user.name).join(', ')
      : 'Sin empleados';
  }

}

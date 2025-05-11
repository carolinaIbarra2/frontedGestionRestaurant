import { Component } from '@angular/core';
import { FacturaService } from '../../services/factura.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-factuta-detail',
  templateUrl: './factuta-detail.component.html',
  styleUrls: ['./factuta-detail.component.css']
})
export class FactutaDetailComponent {
  factura: any = null;
  isEditing: boolean = false; 
  methodPayments: any[] = [];
  errorMessage: string = '';

  constructor(private facturaService: FacturaService, private route: ActivatedRoute) {}

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

    if (!this.isEditing && this.factura && this.factura.id) {
      
      this.facturaService.updateFactura(this.factura.id, { 
        prefix: this.factura.prefix,
        consecutive: this.factura.consecutive,
        value: this.factura.value,
        table_number: this.factura.table_number,
        customer: this.factura.customer,
        estado: this.factura.estado,
        products: this.factura.products})
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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MethodPaymentService } from 'src/app/services/methodPayment.service';

@Component({
  selector: 'app-method-payment-detail',
  templateUrl: './method-payment-detail.component.html',
  styleUrls: ['./method-payment-detail.component.css']
})
export class MethodPaymentDetailComponent implements OnInit {

  methodPayment: any = null;
  isEditing: boolean = false;
  errorMessage: string = '';

  constructor(private methodPaymentService: MethodPaymentService, private route: ActivatedRoute) {}

  ngOnInit(): void {
      
    const methodPaymentId = Number(this.route.snapshot.paramMap.get('id'));
    if (methodPaymentId) {
      this.methodPaymentService.getMethodPaymentById(methodPaymentId).subscribe(
        data => {
          this.methodPayment = data;
        },
        error => {
          console.error('Error al obtener el rol;', error);
        }
      );
    }
  }


  edit(): void {
    this.isEditing = !this.isEditing;

    if(!this.isEditing && this.methodPayment && this.methodPayment.id) {
      this.methodPaymentService.updateMethodPayment(this.methodPayment.id, {
        name: this.methodPayment.name,
        is_active: this.methodPayment.is_active }).subscribe({
          next: () => {},
          error: (err) => {
            if (err.error && err.error.error) {
              this.errorMessage = err.error.error; // <-- mensaje del backend
            } else {
              this.errorMessage = 'Error en el registro. Verifique los datos.';
            }
          }
        });
    }
  }
}

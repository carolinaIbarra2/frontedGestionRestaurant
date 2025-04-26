import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {
  customer: any = null;
  isEditing: boolean = false;
  errorMessage: string = '';

  constructor(private customerService: CustomerService, private route: ActivatedRoute){}

  ngOnInit(): void {
      
    const customerId = Number(this.route.snapshot.paramMap.get('id'));
    if (customerId) {
      this.customerService.getCustomerById(customerId).subscribe(
        data => {
          this.customer = data;
        },
        error => {
          console.error('Error al obtener el cliente.', error);
        }
      );
    }
  }

  edit(): void {
    this.isEditing = !this.isEditing;
  
    if (!this.isEditing && this.customer && this.customer.id) {
      this.customerService.updateCustomer(this.customer.id, { 
        name: this.customer.name,
        last_name: this.customer.last_name,
        email: this.customer.email,
        identification: this.customer.identification,
        phone_number: this.customer.phone_number,
        address: this.customer.address}).subscribe({
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

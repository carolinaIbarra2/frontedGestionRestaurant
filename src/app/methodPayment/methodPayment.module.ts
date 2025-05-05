import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MethodPaymentRoutingModule } from './methodPayment-routing.module';
import { MethodPaymentListComponent } from './method-payment-list/method-payment-list.component';
import { RegisterComponent } from './register/register.component';
import { MethodPaymentDetailComponent } from './method-payment-detail/method-payment-detail.component';

@NgModule({
    declarations: [
        MethodPaymentListComponent,
        RegisterComponent,
        MethodPaymentDetailComponent
    ],
    imports: [
        CommonModule,
        MethodPaymentRoutingModule,
        ReactiveFormsModule,
        FormsModule
    ]
})
export class MethodPaymentModule {}
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MethodPaymentListComponent } from "./method-payment-list/method-payment-list.component";
import { RegisterComponent } from "./register/register.component";
import { MethodPaymentDetailComponent } from "./method-payment-detail/method-payment-detail.component";

const routes: Routes = [
    { path: '', component: MethodPaymentListComponent }, //Ruta para listar metodos de pago
    { path: 'register', component: RegisterComponent }, 
    { path: 'detail/:id', component: MethodPaymentDetailComponent } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MethodPaymentRoutingModule { }


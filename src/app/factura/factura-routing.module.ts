import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';
import { FacturaListComponent } from "./factura-list/factura-list.component";
import { RegisterComponent } from "./register/register.component";
import { FactutaDetailComponent } from "./factuta-detail/factuta-detail.component";

const routes: Routes = [
    { path: '', component: FacturaListComponent },
    { path: 'register',component: RegisterComponent },
    { path: 'detail/:id', component: FactutaDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FacturaRoutingModule { }

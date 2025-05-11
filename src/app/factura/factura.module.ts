import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FacturaRoutingModule } from './factura-routing.module';
import { FacturaListComponent } from './factura-list/factura-list.component';
import { RegisterComponent } from './register/register.component';
import { FactutaDetailComponent } from './factuta-detail/factuta-detail.component';

@NgModule({
    declarations: [
        FacturaListComponent,
        RegisterComponent,
        FactutaDetailComponent 
    ],
    imports: [
        CommonModule,
        FacturaRoutingModule,
        ReactiveFormsModule,
        FormsModule
    ]
})
export class FacturaModule {}
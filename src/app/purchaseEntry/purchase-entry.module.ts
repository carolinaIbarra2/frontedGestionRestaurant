import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PurchaseEntryListComponent } from './purchase-entry-list/purchase-entry-list.component';
import { PurchaseEntryRoutingModule } from './purchase-entry-routing.module';
import { RegisterComponent } from './register/register.component';

@NgModule({
    declarations: [
        PurchaseEntryListComponent,
        RegisterComponent
    ],
    imports: [
        CommonModule,
        PurchaseEntryRoutingModule,
        ReactiveFormsModule,
        FormsModule
    ]
})
export class PurchaseEntryModule {}
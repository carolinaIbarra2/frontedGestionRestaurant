import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PurchaseEntryListComponent } from './purchase-entry-list/purchase-entry-list.component';
import { PurchaseEntryRoutingModule } from './purchase-entry-routing.module';

@NgModule({
    declarations: [
        PurchaseEntryListComponent
    ],
    imports: [
        CommonModule,
        PurchaseEntryRoutingModule,
        ReactiveFormsModule,
        FormsModule
    ]
})
export class PurchaseEntryModule {}
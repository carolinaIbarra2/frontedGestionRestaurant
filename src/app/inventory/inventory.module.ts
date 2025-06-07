import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { InventoryRoutingModule } from './inventory-routing.module';

@NgModule({
    declarations: [
        InventoryListComponent
    ],
    imports: [
        CommonModule,
        InventoryRoutingModule,
        ReactiveFormsModule,
        FormsModule
    ]
})
export class InventoryModule {}
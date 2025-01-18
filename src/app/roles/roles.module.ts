import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './rol-list/roles.component';
import { RolCreateComponent } from './rol-create/rol-create.component';
import { RolDeleteComponent } from './rol-delete/rol-delete.component';

@NgModule({
  declarations: [
    RolesComponent,
    RolCreateComponent,
    RolDeleteComponent
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,
    ReactiveFormsModule
  ]
})
export class RolesModule { }

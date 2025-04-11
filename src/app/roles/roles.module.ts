import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './rol-list/roles.component';
import { RegisterComponent } from './register/register.component';
import { RolDetailComponent } from './rol-detail/rol-detail.component';

@NgModule({
  declarations: [
    RolesComponent,
    RegisterComponent,
    RolDetailComponent
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class RolesModule { }

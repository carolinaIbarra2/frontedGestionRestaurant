import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesComponent } from './rol-list/roles.component';
import { RolCreateComponent } from './rol-create/rol-create.component';
import { RolDeleteComponent } from './rol-delete/rol-delete.component';

const routes: Routes = [
  { path: '', component: RolesComponent },  // Ruta para la lista de roles
  { path: 'create', component: RolCreateComponent} , // Ruta para crear un rol
  { path: 'delete/:id', component: RolDeleteComponent}  // Ruta para eliminar un rol
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }

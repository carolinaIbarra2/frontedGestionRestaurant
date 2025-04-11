import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesComponent } from './rol-list/roles.component';
import { RegisterComponent } from './register/register.component';
import { RolDetailComponent } from './rol-detail/rol-detail.component';

const routes: Routes = [
  { path: '', component: RolesComponent },  // Ruta para la lista de roles
  { path: 'register', component: RegisterComponent} , // Ruta para crear un rol
  { path: 'detail/:id', component: RolDetailComponent}  // Ruta para eliminar un rol
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }

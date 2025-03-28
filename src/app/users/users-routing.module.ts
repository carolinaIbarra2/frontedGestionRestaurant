import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './user-list/users.component';

const routes: Routes = [
  { path: '', component: UsersComponent },  // Ruta para la lista de usuarios
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }

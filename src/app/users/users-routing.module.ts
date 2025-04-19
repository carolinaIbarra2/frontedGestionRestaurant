import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './user-list/users.component';
import { RegisterComponent } from './register/register.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { EditPasswordComponent } from './edit-password/edit-password.component';

const routes: Routes = [
  { path: '', component: UsersComponent },  // Ruta para la lista de usuarios
  { path: 'register', component: RegisterComponent },
  { path: 'detail/:id', component: UserDetailComponent },
  { path: 'edit-password', component: EditPasswordComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { RegisterComponent } from './users/register/register.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirige a login por defecto
  { path: 'login', component: LoginComponent },   // Ruta para el login
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },  
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },  // Carga el módulo de usuarios
      { path: 'roles', loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule) }  // Carga el módulo de roles        
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

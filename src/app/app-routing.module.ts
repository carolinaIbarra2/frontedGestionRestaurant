import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './shared/dashboard/dashboard.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },   // Ruta para el login  
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'roles', loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule) }  // Carga el módulo de roles
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

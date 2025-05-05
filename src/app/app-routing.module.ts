import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './shared/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirige a login por defecto
  { path: 'login', component: LoginComponent },   // Ruta para el login
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) },  // Carga el módulo de usuarios
      { path: 'customers', loadChildren: () => import('./customer/customers.module').then(m => m.CustomersModule) },  // Carga el módulo de clientes
      { path: 'roles', loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule) },  // Carga el módulo de roles        
      { path: 'categories', loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesModule) }, // Carga el módulo de categorias
      { path: 'products', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule) }, // Carga el módulo de productos
      { path: 'methodPayments', loadChildren: () => import('./methodPayment/methodPayment.module').then(m => m.MethodPaymentModule) }, // Carga el módulo de formas de pago
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

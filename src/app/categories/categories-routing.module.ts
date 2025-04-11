import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './category-list/categories.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: '', component: CategoriesComponent }, //Ruta para la lista de categorias
  { path: 'register', component: RegisterComponent } //Ruta para crear una categoria
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }

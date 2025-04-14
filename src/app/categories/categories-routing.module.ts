import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './category-list/categories.component';
import { RegisterComponent } from './register/register.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';

const routes: Routes = [
  { path: '', component: CategoriesComponent }, //Ruta para la lista de categorias
  { path: 'register', component: RegisterComponent }, //Ruta para crear una categoria
  { path: 'detail/:id', component: CategoryDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }

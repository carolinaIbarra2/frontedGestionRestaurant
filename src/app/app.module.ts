import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './users/register/register.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { CategoryDetailComponent } from './categories/category-detail/category-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { RolesModule } from './roles/roles.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserDetailComponent,
    ProductDetailComponent,
    CategoryDetailComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    RolesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

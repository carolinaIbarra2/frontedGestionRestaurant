import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // lógica para verificar el token
    const token = localStorage.getItem('auth_token');
    if (token) {
      return true; // Permitir acceso
    } else {
      this.router.navigate(['/login']); // Redirigir al login
      return false; // Bloquear acceso
    }
  }
}
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private refresh = false;
  private refreshToken: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private userService: UserService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('access_token');

    if (token) {
      request = this.addToken(request, token);
    }
    return next.handle(request).pipe(
      catchError(error => {
        if ( error.status === 401 &&
          !request.url.includes('/login') &&
          !request.url.includes('/token/refresh')) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Manejar el error 401 (token expirado o no válido)
  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.refresh) {
      this.refresh = true;
      this.refreshToken.next(null);

      // Obtener el refresh token para obtener un nuevo access token
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        return throwError(() => new Error('No refresh token available'));
      }

      // Solicitar el nuevo token desde el UserService
      return this.userService.refreshToken(refreshToken).pipe(
        switchMap((tokenResponse: any) => {
          this.refresh = false;

          // Guardar el nuevo access token y pasarlo en la solicitud
          const newAccessToken = tokenResponse.access;
          localStorage.setItem('access_token', newAccessToken);
          this.refreshToken.next(newAccessToken);

          return next.handle(this.addToken(request, newAccessToken)); // Reintentar la solicitud con el nuevo token
        }),
        catchError((err) => {
          this.refresh = false;
          this.userService.logout(); // Por si el refresh falla          
          return throwError(() => err);
        })
      );
    } else {
      // Si ya estamos intentando refrescar el token, esperar hasta que termine
      return this.refreshToken.pipe(
        filter(token => token !== null),
        take(1),
        switchMap((token) => next.handle(this.addToken(request, token!)))
      );
    }
  }

}

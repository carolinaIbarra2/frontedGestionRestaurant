import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserService } from '../services/user.service';
import { catchError, Observable, switchMap, throwError } from "rxjs";



@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(private userService: UserService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('access_token');

        if (token) {
            req = req.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
            });
        }

        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
              if (error.status === 401 && localStorage.getItem('refresh_token')) {
                return this.userService.refreshToken().pipe(
                  switchMap(() => {
                    const newToken = localStorage.getItem('access_token');
                    const newReq = req.clone({
                      setHeaders: { Authorization: `Bearer ${newToken}` }
                    });
                    return next.handle(newReq);
                  })
                );
              }
      
              return throwError(() => error);
            })
        );
    }
}
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private router: Router) { }

  /**
   * Intercepts HTTP requests and adds an Authorization header with a token from local storage,
   * if available. Handles HTTP error responses, specifically redirecting to '/login' on 401 Unauthorized.
   * @param request The HTTP request to intercept and modify headers.
   * @param next The HTTP handler to pass the modified request to.
   * @returns An Observable of the HTTP event stream with error handling.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Token ${token}` }
      });
    }

    return next.handle(request).pipe(catchError((err) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.router.navigateByUrl('/login');
        }
      }
      return throwError(() => err);
    }));
  }
}
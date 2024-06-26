import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { SnackbarsComponent } from '../components/snackbars/snackbars.component';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthComponent,
    private router: Router,
    private snackbarsComponent: SnackbarsComponent
  ) {}

  /**
   * checks if user is logged in, otherwise access to /board will be denied
   * @returns 
   */
  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true; // return true, true = user ist logged in, token is given
    } else {
        this.snackbarsComponent.openSnackBar('You must be logged in', false, false);
        this.router.navigate(['/login']); // redirect to /login
        return false;
    }
  }
}

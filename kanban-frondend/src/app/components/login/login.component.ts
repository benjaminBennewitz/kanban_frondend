import { Component, OnInit } from '@angular/core';
import { ThemesComponent } from '../../services/themes/themes.component';
import { DialogRegisterComponent } from '../dialog-register/dialog-register.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarsComponent } from '../snackbars/snackbars.component';
import { Router } from '@angular/router';
import { AuthComponent } from '../../services/auth/auth.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {

  username: String = '';
  password: String = '';

  constructor(
    private themesComponent: ThemesComponent,
    public dialog: MatDialog,
    private snackbarsComponent: SnackbarsComponent,
    private router: Router,
    private as: AuthComponent,
  ) { }

  ngOnInit(): void {
    const savedTheme = localStorage.getItem(this.themesComponent.getLocalStorageKey());
    if (savedTheme) {
      this.themesComponent.onThemeChange(savedTheme);
    }
  }

  /**
   * 
   * @returns 
   */
  async login() {
    try {
      let resp: any = await this.as.loginWithUserAndPassword(this.username, this.password);

      console.log(resp);
      localStorage.setItem('token', resp['token']);
      this.router.navigateByUrl('/todos');
      
    } catch (e) {
      alert('Login declined');
      console.error(e);
    }
  }

  /**
   * saves the selected theme in param selectedTheme
   * @param selectedTheme 
   */
  onThemeChange(selectedTheme: string) {
    this.themesComponent.onThemeChange(selectedTheme);
  }

  /**
   * calls the login successful snackbar
   */
  loginDialog() {
    this.snackbarsComponent.openSnackBar('Login successful!', true, true);
    setTimeout(() => {
      this.router.navigate(['/board']);
    }, 1500); // Delay of 1.5 seconds
  }

  /**
   * calls the registration form
   */
  registerDialog() {
    const dialogRef = this.dialog.open(DialogRegisterComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'registered') {
        this.snackbarsComponent.openSnackBar('Registration successful! - Please log in', true, true);
        // No navigation here
      }
    });
  }
}
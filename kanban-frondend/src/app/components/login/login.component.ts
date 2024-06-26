import { Component, OnInit, ViewChild } from '@angular/core';
import { ThemesComponent } from '../../services/themes/themes.component';
import { DialogRegisterComponent } from '../dialog-register/dialog-register.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarsComponent } from '../snackbars/snackbars.component';
import { Router } from '@angular/router';
import { AuthComponent } from '../../services/auth/auth.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';

  @ViewChild('loginForm') loginForm!: NgForm;

  constructor(
    private themesComponent: ThemesComponent,
    public dialog: MatDialog,
    private snackbarsComponent: SnackbarsComponent,
    private router: Router,
    private as: AuthComponent,
  ) { }

  ngOnInit(): void {
    // saves the selected theme to local storage
    const savedTheme = localStorage.getItem(this.themesComponent.getLocalStorageKey());
    if (savedTheme) {
      this.themesComponent.onThemeChange(savedTheme);
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
   * login function
   * @returns 
   */
    async login() {
      try {
        let resp: any = await this.as.loginWithUserAndPassword(this.username, this.password);
        console.log(resp);
        localStorage.setItem('token', resp['token']);
        this.as.setUsername(this.username); // saves the username in auth.component
        this.snackbarsComponent.openSnackBar('Login successful!', true, true);
        setTimeout(() => {
          this.router.navigateByUrl('/board');
        }, 1500);
      } catch (e) {
        this.snackbarsComponent.openSnackBar('Login denied!', false, false);
        console.error(e);
      }
    }
  
  /**
   * calls the registration form
   */
  registerDialog() {
    const dialogRef = this.dialog.open(DialogRegisterComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'registered') {
        this.snackbarsComponent.openSnackBar('Registration successful! - Please log in', true, true);
      }
    });
  }
}
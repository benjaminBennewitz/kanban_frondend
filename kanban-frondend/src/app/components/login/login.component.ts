import { Component, OnInit, Inject } from '@angular/core';
import { ThemesComponent } from '../../services/themes/themes.component';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { DialogRegisterComponent } from '../dialog-register/dialog-register.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SnackbarsComponent } from '../snackbars/snackbars.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(
    private themesComponent: ThemesComponent,
    public dialog: MatDialog,
    private snackbarsComponent: SnackbarsComponent,
    private router: Router,
  ) { }

  ngOnInit(): void {
    const savedTheme = localStorage.getItem(this.themesComponent.getLocalStorageKey());
    if (savedTheme) {
      this.themesComponent.onThemeChange(savedTheme);
    }
  }

  onThemeChange(selectedTheme: string) {
    this.themesComponent.onThemeChange(selectedTheme);
  }

  loginDialog() {
    this.snackbarsComponent.openSnackBar('Login successful!', true, true);
    setTimeout(() => {
      this.router.navigate(['/board']);
    }, 1500); // Delay of 1.5 seconds
  }

  registerDialog() {
    const dialogRef = this.dialog.open(DialogRegisterComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'registered') {
        this.snackbarsComponent.openSnackBar('Registration successful!', true, true);
        // No navigation here
      }
    });
  }
}
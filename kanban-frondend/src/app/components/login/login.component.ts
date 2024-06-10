import { Component, OnInit, Inject } from '@angular/core';
import { ThemesComponent } from '../../services/themes/themes.component';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { DialogRegisterComponent } from '../dialog-register/dialog-register.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(
    private themesComponent: ThemesComponent,
    public dialog: MatDialog
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

  openDialog() {
    this.dialog.open(DialogRegisterComponent);
  }
}
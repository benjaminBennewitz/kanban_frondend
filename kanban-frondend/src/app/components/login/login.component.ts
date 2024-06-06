import { Component, OnInit, inject } from '@angular/core';
import { ThemesComponent } from '../../services/themes/themes.component';
import { MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(private themesComponent: ThemesComponent) { }

  ngOnInit(): void {
    const savedTheme = localStorage.getItem(this.themesComponent.getLocalStorageKey());
    if (savedTheme) {
      this.themesComponent.onThemeChange(savedTheme);
    }
  }

  onThemeChange(selectedTheme: string) {
    this.themesComponent.onThemeChange(selectedTheme);
  }
}

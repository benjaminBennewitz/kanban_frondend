import { Component } from '@angular/core';
import { ThemesComponent } from '../../services/themes/themes.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

  constructor(private ThemesComponent: ThemesComponent) { }

  onThemeChange(selectedTheme: string) {
    this.ThemesComponent.onThemeChange(selectedTheme);
  }
}
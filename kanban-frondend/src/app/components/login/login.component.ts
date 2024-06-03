import { Component } from '@angular/core';
import { ThemesComponent } from '../../services/themes/themes.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  constructor(private themesComponent: ThemesComponent) { }

  onThemeChange(selectedTheme: string, containerStates?: any) {
    this.themesComponent.onThemeChange(selectedTheme, []);
  }
}
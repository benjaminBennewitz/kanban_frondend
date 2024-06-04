import { Component, OnInit } from '@angular/core';
import { ThemesComponent } from '../../services/themes/themes.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(private themesComponent: ThemesComponent) { }

  ngOnInit(): void {
    // Beim Initialisieren die Theme-Einstellung aus dem localStorage laden
    const savedTheme = localStorage.getItem(this.themesComponent.getLocalStorageKey());
    if (savedTheme) {
      this.themesComponent.onThemeChange(savedTheme);
    }
  }

  onThemeChange(selectedTheme: string) {
    // Thema ändern und im localStorage speichern
    this.themesComponent.onThemeChange(selectedTheme);
  }
}

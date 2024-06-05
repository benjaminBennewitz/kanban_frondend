import { Component, Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ThemeConfig {
  mainWrapper: string;
  loginBtnContainer: string;
}

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.scss'],
})
export class ThemesComponent {
  private currentThemeSubject = new BehaviorSubject<string>('default');
  currentTheme$ = this.currentThemeSubject.asObservable();
  private localStorageKey = 'selectedTheme';

  public getLocalStorageKey(): string {
    return this.localStorageKey;
  }

  private themeClassMapping: { [key: string]: ThemeConfig } = {
    'light-theme': {
      mainWrapper: 'main-wrapper-light',
      loginBtnContainer: 'login-btn-light',
    },
    'dark-theme': {
      mainWrapper: 'main-wrapper-dark',
      loginBtnContainer: 'login-btn-dark',
    },
    default: {
      mainWrapper: 'main-wrapper',
      loginBtnContainer: 'login-btn',
    },
  };

  constructor(private renderer: Renderer2) {
    // Beim Initialisieren die Theme-Einstellung aus dem localStorage laden
    const savedTheme = localStorage.getItem(this.localStorageKey);
    if (savedTheme) {
      this.currentThemeSubject.next(savedTheme);
    }
  }

  /**
   * Function called when theme is changed
   * @param selectedTheme
   * @param _containerStates
   */
  onThemeChange(selectedTheme: string,) {
    this.currentThemeSubject.next(selectedTheme);
    this.saveThemeToLocalStorage(selectedTheme);

    const mainWrapper = document.getElementById('mainWrapper');
    const loginBtnContainer = document.getElementById('loginBtnContainer');

    if (mainWrapper) {
      this.removeOldClasses(mainWrapper);
      this.addNewClass(mainWrapper, selectedTheme);
    }
    if (loginBtnContainer) {
      this.removeOldClasses(loginBtnContainer);
      this.addNewClassBtn(loginBtnContainer, selectedTheme);
    }
  }

  /**
   * Function to remove all theme classes
   * @param element
   */
  private removeOldClasses(element: HTMLElement) {
    element.classList.remove(
      'main-wrapper',
      'main-wrapper-light',
      'main-wrapper-dark',

      'login-btn',
      'login-btn-light',
      'login-btn-dark'
    );
  }

  /**
   * Function to set the right theme class by selection
   * @param element
   * @param selectedTheme
   */
  private addNewClass(element: HTMLElement, selectedTheme: string) {
    const themeConfig =
      this.themeClassMapping[selectedTheme] ||
      this.themeClassMapping['default'];
    this.renderer.addClass(element, themeConfig.mainWrapper);
  }

    /**
   * Function to set the right theme class by selection
   * @param element
   * @param selectedTheme
   */
    private addNewClassBtn(element: HTMLElement, selectedTheme: string) {
      const themeConfig =
        this.themeClassMapping[selectedTheme] ||
        this.themeClassMapping['default'];
      this.renderer.addClass(element, themeConfig.loginBtnContainer);
    }

  /**
   * Function to save selected theme to local storage
   * @param theme
   */
  private saveThemeToLocalStorage(theme: string) {
    localStorage.setItem(this.localStorageKey, theme);
  }
}
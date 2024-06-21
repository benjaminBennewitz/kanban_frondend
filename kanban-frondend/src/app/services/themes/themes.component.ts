import { Component, Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ThemeConfig {
  mainWrapper: string;
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

  constructor(private renderer: Renderer2) {
    const savedTheme = localStorage.getItem(this.localStorageKey);
    if (savedTheme) {
      this.currentThemeSubject.next(savedTheme);
      this.applyTheme(savedTheme);
    }
  }

  /**
   * gets theme selection from local storage
   * @returns 
   */
  public getLocalStorageKey(): string {
    return this.localStorageKey;
  }

  /**
   * help function to set the right theme classes on login.component
   */
  private themeClassMapping: { [key: string]: ThemeConfig } = {
    'light-theme': {
      mainWrapper: 'main-wrapper-light',
    },
    'dark-theme': {
      mainWrapper: 'main-wrapper-dark',
    },
    default: {
      mainWrapper: 'main-wrapper',
    },
  };

  /**
   * Function called when theme is changed
   * @param selectedTheme
   */
  onThemeChange(selectedTheme: string) {
    this.currentThemeSubject.next(selectedTheme);
    this.saveThemeToLocalStorage(selectedTheme);

    const mainWrapper = document.getElementById('mainWrapper');
    if (mainWrapper) {
      this.removeOldClasses(mainWrapper);
      this.addNewClass(mainWrapper, selectedTheme);
    }
    // Apply theme to body for scrollbar styling
    this.applyTheme(selectedTheme);
  }

  /**
   * Function to remove all theme classes
   * @param element
   */
  private removeOldClasses(element: HTMLElement) {
    element.classList.remove(
      'main-wrapper',
      'main-wrapper-light',
      'main-wrapper-dark'
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
   * Function to save selected theme to local storage
   * @param theme
   */
  private saveThemeToLocalStorage(theme: string) {
    localStorage.setItem(this.localStorageKey, theme);
  }

  /**
   * Apply theme to body element for scrollbar styling
   * @param theme
   */
  private applyTheme(theme: string) {
    document.body.classList.remove('default-theme', 'light-theme', 'dark-theme');
    document.body.classList.add(theme);
  }
}
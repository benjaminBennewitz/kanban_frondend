import { Component, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrl: './themes.component.scss'
})
export class ThemesComponent {


  /**
   * Function called when theme is changed
   * @param selectedTheme 
   */
  onThemeChange(selectedTheme: string) {
    const mainWrapper = document.getElementById('mainWrapper');

    if (mainWrapper) {
      this.removeOldClasses(mainWrapper);
      this.addNewClass(mainWrapper, selectedTheme);
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
    );
  }

  /**
   * Function to set the right theme class by selection
   * @param element 
   * @param selectedTheme 
   */
  private addNewClass(element: HTMLElement, selectedTheme: string) {
    switch (selectedTheme) {
      case 'light-theme':
        element.classList.add('main-wrapper-light');
        break;
      case 'dark-theme':
        element.classList.add('main-wrapper-dark');
        break;
      default: //default Theme
        element.classList.add('main-wrapper');
        break;
    }
  }
}
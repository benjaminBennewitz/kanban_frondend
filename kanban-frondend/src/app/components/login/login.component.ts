import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {


  /**
   * function called when theme is changed
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
   * function to remove all theme classes
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
   * function to set the right theme class by selection
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
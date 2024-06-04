import { Component, Injectable, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface ThemeConfig {
  mainWrapper: string;
  sideNav: string;
  navToolbar: string;
  boardBG: string;
  mainBoardBG: string;
  emptyCards: string;
  headings: string;
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

  private themeClassMapping: { [key: string]: ThemeConfig } = {
    'light-theme': {
      mainWrapper: 'main-wrapper-light',
      sideNav: 'board-sidenav-light',
      navToolbar: 'board-toolbar-light',
      boardBG: 'board-wrapper-light',
      mainBoardBG: 'board-bg-light',
      emptyCards: 'board-card-wrapper-empty-light',
      headings: 'board-heading-light',
    },
    'dark-theme': {
      mainWrapper: 'main-wrapper-dark',
      sideNav: 'board-sidenav-dark',
      navToolbar: 'board-toolbar-dark',
      boardBG: 'board-wrapper-dark',
      mainBoardBG: 'board-bg-dark',
      emptyCards: 'board-card-wrapper-empty-dark',
      headings: 'board-heading-dark',
    },
    default: {
      mainWrapper: 'main-wrapper',
      sideNav: 'board-sidenav',
      navToolbar: 'board-toolbar',
      boardBG: 'board-wrapper',
      mainBoardBG: 'board-bg',
      emptyCards: 'board-card-wrapper-empty',
      headings: 'board-heading',
    },
  };

  constructor(private renderer: Renderer2) { }

  /**
   * Function called when theme is changed
   * @param selectedTheme
   * @param containerStates
   */
  onThemeChange(selectedTheme: string, containerStates: { id: string, isEmpty: boolean }[]) {
    console.log('Selected Theme:', selectedTheme);
    this.currentThemeSubject.next(selectedTheme);
  
    const mainWrapper = document.getElementById('mainWrapper');
    const sideNav = document.getElementById('sideNav');
    const navToolbar = document.getElementById('navToolbar');
    const boardBG = document.getElementById('boardBG');
    const mainBoardBG = document.getElementById('mainBoardBG');
    
    const headings = document.getElementsByClassName('1001');

    if (mainWrapper) {
      this.removeOldClasses(mainWrapper);
      this.addNewClass(mainWrapper, selectedTheme);
    }
    if (sideNav) {
      this.removeOldClasses(sideNav);
      this.addNewClassNav(sideNav, selectedTheme);
    }
    if (navToolbar) {
      this.removeOldClasses(navToolbar);
      this.addNewClassBar(navToolbar, selectedTheme);
    }
    if (boardBG) {
      this.removeOldClasses(boardBG);
      this.addNewClassBg(boardBG, selectedTheme);
    }
    if (mainBoardBG) {
      this.removeOldClasses(mainBoardBG);
      this.addNewClassMainBoardBG(mainBoardBG, selectedTheme);
    }

    if (headings) {
      // Iterate through the HTMLCollection and apply classes to each element
      Array.from(headings).forEach((heading: Element) => {
        this.removeOldClasses(heading as HTMLElement);
        this.addNewClassHeadings(heading as HTMLElement, selectedTheme);
      });
    }

    containerStates.forEach(containerState => {
      const container = document.getElementById(containerState.id);
      if (container) {
        this.removeOldClasses(container);
        if (containerState.isEmpty) {
          this.addNewClassEmptyCards(container, selectedTheme);
        }
      }
    });
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

      'board-sidenav',
      'board-sidenav-light',
      'board-sidenav-dark',

      'board-toolbar',
      'board-toolbar-light',
      'board-toolbar-dark',

      'board-card',
      'board-card-light',
      'board-card-dark',

      'board-wrapper',
      'board-wrapper-light',
      'board-wrapper-dark',

      'board-bg',
      'board-bg-light',
      'board-bg-dark',

      'board-card-wrapper-empty',
      'board-card-wrapper-empty-light',
      'board-card-wrapper-empty-dark',

      'board-heading',
      'board-heading-light',
      'board-heading-dark',

      'board-card-subtitle',
      'board-card-subtitle-light',
      'board-card-subtitle-dark',
    );
  }

  /**
   * Function to set the right theme class by selection
   * @param element
   * @param selectedTheme
   */
  private addNewClass(element: HTMLElement, selectedTheme: string) {
    const themeConfig =
      this.themeClassMapping[selectedTheme] || this.themeClassMapping['default'];
    this.renderer.addClass(element, themeConfig.mainWrapper);
  }

  /**
   * Function to set the right theme class by selection for sideNav
   * @param element
   * @param selectedTheme
   */
  private addNewClassNav(element: HTMLElement, selectedTheme: string) {
    const themeConfig =
      this.themeClassMapping[selectedTheme] || this.themeClassMapping['default'];
    this.renderer.addClass(element, themeConfig.sideNav);
  }

  /**
   * Function to set the right theme class by selection for navToolbar
   * @param element
   * @param selectedTheme
   */
  private addNewClassBar(element: HTMLElement, selectedTheme: string) {
    const themeConfig =
      this.themeClassMapping[selectedTheme] || this.themeClassMapping['default'];
    this.renderer.addClass(element, themeConfig.navToolbar);
  }


  /**
   * Function to set the right theme class by selection for navToolbar
   * @param element
   * @param selectedTheme
   */
  private addNewClassBg(element: HTMLElement, selectedTheme: string) {
    const themeConfig =
      this.themeClassMapping[selectedTheme] || this.themeClassMapping['default'];
    this.renderer.addClass(element, themeConfig.boardBG);
  }

  /**
   * Function to set the right theme class by selection for navToolbar
   * @param element
   * @param selectedTheme
   */
  private addNewClassMainBoardBG(element: HTMLElement, selectedTheme: string) {
    const themeConfig =
      this.themeClassMapping[selectedTheme] || this.themeClassMapping['default'];
    this.renderer.addClass(element, themeConfig.mainBoardBG);
  }

  /**
   * Function to set the right theme class by selection for empty cards
   * @param element
   * @param selectedTheme
   */
  private addNewClassEmptyCards(element: HTMLElement, selectedTheme: string) {
    const themeConfig =
      this.themeClassMapping[selectedTheme] || this.themeClassMapping['default'];
    this.renderer.addClass(element, themeConfig.emptyCards);
  }

  /**
   * Function to set the right theme class by selection for headings
   * @param element
   * @param selectedTheme
   */
  private addNewClassHeadings(element: HTMLElement, selectedTheme: string) {
    const themeConfig =
      this.themeClassMapping[selectedTheme] || this.themeClassMapping['default'];
    this.renderer.addClass(element, themeConfig.headings);
  }
}
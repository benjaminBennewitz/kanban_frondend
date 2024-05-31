import { Component, Injectable, Renderer2 } from '@angular/core';

interface ThemeConfig {
  mainWrapper: string;
  sideNav: string;
  navToolbar: string;
  cards: string;
  boardBG: string;
  mainBoardBG: string;
}

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrl: './themes.component.scss',
})
export class ThemesComponent {
  private themeClassMapping: { [key: string]: ThemeConfig } = {
    'light-theme': {
      mainWrapper: 'main-wrapper-light',
      sideNav: 'board-sidenav-light',
      navToolbar: 'board-toolbar-light',
      cards: 'board-card-light',
      boardBG: 'board-wrapper-light',
      mainBoardBG: 'board-bg-light',
    },
    'dark-theme': {
      mainWrapper: 'main-wrapper-dark',
      sideNav: 'board-sidenav-dark',
      navToolbar: 'board-toolbar-dark',
      cards: 'board-card-dark',
      boardBG: 'board-wrapper-dark',
      mainBoardBG: 'board-bg-dark',
    },
    default: {
      mainWrapper: 'main-wrapper',
      sideNav: 'board-sidenav',
      navToolbar: 'board-toolbar',
      cards: 'board-card',
      boardBG: 'board-wrapper',
      mainBoardBG: 'board-bg',
    },
  };

  constructor(private renderer: Renderer2) {}

  /**
   * Function called when theme is changed
   * @param selectedTheme
   */
  onThemeChange(selectedTheme: string) {
    const mainWrapper = document.getElementById('mainWrapper');
    const sideNav = document.getElementById('sideNav');
    const navToolbar = document.getElementById('navToolbar');
    const cards = document.getElementsByClassName('cards');
    const boardBG = document.getElementById('boardBG');
    const mainBoardBG = document.getElementById('mainBoardBG');


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
    if (cards) {
      // Iterate through the HTMLCollection and apply classes to each element
      Array.from(cards).forEach((card: Element) => {
        this.removeOldClasses(card as HTMLElement);
        this.addNewClassCards(card as HTMLElement, selectedTheme);
      });
    }
    if (boardBG) {
      this.removeOldClasses(boardBG);
      this.addNewClassBg(boardBG, selectedTheme);
    }
    if (mainBoardBG) {
      this.removeOldClasses(mainBoardBG);
      this.addNewClassMainBoardBG(mainBoardBG, selectedTheme);
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
   * Function to set the right theme class by selection for sideNav
   * @param element
   * @param selectedTheme
   */
  private addNewClassNav(element: HTMLElement, selectedTheme: string) {
    const themeConfig =
      this.themeClassMapping[selectedTheme] ||
      this.themeClassMapping['default'];
    this.renderer.addClass(element, themeConfig.sideNav);
  }

  /**
   * Function to set the right theme class by selection for navToolbar
   * @param element
   * @param selectedTheme
   */
  private addNewClassBar(element: HTMLElement, selectedTheme: string) {
    const themeConfig =
      this.themeClassMapping[selectedTheme] ||
      this.themeClassMapping['default'];
    this.renderer.addClass(element, themeConfig.navToolbar);
  }

  /**
   * Function to set the right theme class by selection for cards
   * @param element
   * @param selectedTheme
   */
  private addNewClassCards(element: HTMLElement, selectedTheme: string) {
    const themeConfig =
      this.themeClassMapping[selectedTheme] ||
      this.themeClassMapping['default'];
    this.renderer.addClass(element, themeConfig.cards);
  }

    /**
   * Function to set the right theme class by selection for navToolbar
   * @param element
   * @param selectedTheme
   */
    private addNewClassBg(element: HTMLElement, selectedTheme: string) {
      const themeConfig =
        this.themeClassMapping[selectedTheme] ||
        this.themeClassMapping['default'];
      this.renderer.addClass(element, themeConfig.boardBG);
    }

        /**
   * Function to set the right theme class by selection for navToolbar
   * @param element
   * @param selectedTheme
   */
        private addNewClassMainBoardBG(element: HTMLElement, selectedTheme: string) {
          const themeConfig =
            this.themeClassMapping[selectedTheme] ||
            this.themeClassMapping['default'];
          this.renderer.addClass(element, themeConfig.mainBoardBG);
        }
}

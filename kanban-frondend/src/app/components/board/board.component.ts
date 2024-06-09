import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ThemesComponent } from '../../services/themes/themes.component';

interface Task {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  date: string;
  prio: string;
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  showFiller = false;
  currentTheme: string = 'default';
  hideOverlay = false;

  constructor(private themesComponent: ThemesComponent) {}

  ngOnInit() {
    this.themesComponent.currentTheme$.subscribe((theme) => {
      this.currentTheme = theme;
    });

    //Timeout for welcome slide animation
    setTimeout(() => {
      this.hideBoardOverlay();
    }, 2000);
  }

  /**
   * Hide the board overlay with animation and temporarily disable overflow
   */
  hideBoardOverlay() {
    this.hideOverlay = true;
    this.setTemporaryOverflowHidden();

    // Set a timeout to hide the overlay element completely after the animation
    setTimeout(() => {
      const boardOverlay = document.getElementById('boardOverlay');
      if (boardOverlay) {
        boardOverlay.style.display = 'none';
      }
      this.restoreOverflow();
    }, 2000); // Match the duration of the animation
  }

  /**
   * Temporarily set overflow to hidden
   */
  setTemporaryOverflowHidden() {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }

  /**
   * Restore overflow to auto
   */
  restoreOverflow() {
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
  }

  /**
   * Handle theme change
   * @param selectedTheme 
   */
  onThemeChange(selectedTheme: string) {
    this.themesComponent.onThemeChange(selectedTheme);
  }


  urgent: Task[] = [];

  todo: Task[] = [
    {
      id: 1,
      title: 'Start with Angular',
      subtitle: 'Read documentation and differences',
      content:
        'Many new functions on Angular 18: Material 3, deferrable views and built-in controls flows are now officially stable and bring a number of improvements',
      date: '01 Juni',
      prio: 'urgent',
    },
    {
      id: 2,
      title: 'Start with Django',
      subtitle: 'Install and prepare',
      content: 'Install REST framework, set up venv, check requirements',
      date: '25 Juni',
      prio: 'medium',
    },
    {
      id: 3,
      title: 'Testing theming',
      subtitle: 'Check all themes: light, dark and default',
      content: 'very fiddly thing to make work',
      date: '-',
      prio: 'low',
    },
  ];

  inProgress: Task[] = [
    {
      id: 4,
      title: 'Make Drag and Drop work',
      subtitle: 'Check docs',
      content: 'N/A',
      date: '-',
      prio: '',
    },
    {
      id: 5,
      title: 'Check classes on dragging',
      subtitle: 'Classes are wrong by drag n drop',
      content: 'Check functions and classes',
      date: '08 Juni',
      prio: 'low',
    },
  ];

  done: Task[] = [
    {
      id: 6,
      title: 'Design Board',
      subtitle: 'Make the Layout and css classes',
      content: 'Pay attention to class naming',
      date: '28 Mai',
      prio: 'medium',
    },
  ];

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      if (!event.previousContainer.data || !event.container.data) {
        console.error('Container data is undefined');
        return;
      }
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  getPriorityClass(prio: string): string {
    switch (prio) {
      case 'urgent':
        return 'urgent';
      case 'medium':
        return 'medium';
      case 'low':
        return 'low';
      default:
        return '';
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemesComponent } from '../../services/themes/themes.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

interface Task {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  date: Date;
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
  hideWelcomeOverlay = false;
  hideLogOutOverlay = true;

  constructor(private themesComponent: ThemesComponent, private router: Router) {}

  ngOnInit() {
    this.themesComponent.currentTheme$.subscribe((theme) => {
      this.currentTheme = theme;
    });

    // Ensure the log out overlay is hidden initially
    const boardOverlayLogOut = document.getElementById('boardOverlayLogOut');
    if (boardOverlayLogOut) {
      boardOverlayLogOut.style.display = 'none';
    }

    // Show welcome overlay when the user logs in
    this.showWelcomeOverlay();
  }

  /**
   * Show the welcome overlay and hide it after a delay
   */
  showWelcomeOverlay() {
    this.hideWelcomeOverlay = false;
    this.setTemporaryOverflowHidden();

    setTimeout(() => {
      this.hideWelcomeOverlay = true;

      setTimeout(() => {
        const boardOverlay = document.getElementById('boardOverlay');
        if (boardOverlay) {
          boardOverlay.style.display = 'none';
        }
        this.restoreOverflow();
      }, 2000); // Match the duration of the animation
    }, 2000);
  }

  /**
   * Trigger the log out overlay animation
   */
  triggerLogOutOverlay() {
    this.hideLogOutOverlay = false;
    this.setTemporaryOverflowHidden();
    const boardOverlayLogOut = document.getElementById('boardOverlayLogOut');
    if (boardOverlayLogOut) {
      boardOverlayLogOut.style.display = 'flex';
    }

    setTimeout(() => {
      this.hideLogOutOverlay = true;

      setTimeout(() => {
        if (boardOverlayLogOut) {
          boardOverlayLogOut.style.display = 'none';
        }
        this.restoreOverflow();
        this.router.navigate(['/login']); // Redirect to login page
      }, 900); // Match the duration of the animation
    }, 1500);
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
   * Event handler for the logout button click
   */
  onLogout() {
    this.triggerLogOutOverlay();
  }

  /**
   * Handle theme change
   * @param selectedTheme 
   */
  onThemeChange(selectedTheme: string) {
    this.themesComponent.onThemeChange(selectedTheme);
  }

  
 /**
   * checks if the date is past due
   * @param date 
   * @returns 
   */
 isDatePast(date: Date): boolean {
  const today = new Date();
  return date < today;
}

/**
 * checks if the date is past due
 * @param date 
 * @returns 
 */
isDateOverdue(date: Date): boolean {
  return this.isDatePast(date);
}

// Methode zum Formatieren des Datums
getFormattedDate(date: Date): string {
  return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
}


  urgent: Task[] = [];

  todo: Task[] = [
    {
      id: 1,
      title: 'Start with Angular',
      subtitle: 'Read documentation and differences',
      content:
        'Many new functions on Angular 18: Material 3, deferrable views and built-in controls flows are now officially stable and bring a number of improvements',
      date: new Date('2024-07-22'),
      prio: 'urgent',
    },
    {
      id: 2,
      title: 'Start with Django',
      subtitle: 'Install and prepare',
      content: 'Install REST framework, set up venv, check requirements',
      date: new Date('2024-08-06'),
      prio: 'medium',
    },
    {
      id: 3,
      title: 'Testing theming',
      subtitle: 'Check all themes: light, dark and default',
      content: 'very fiddly thing to make work',
      date: new Date('2024-06-23'),
      prio: 'low',
    },
  ];

  inProgress: Task[] = [
    {
      id: 4,
      title: 'Make Drag and Drop work',
      subtitle: 'Check docs',
      content: 'N/A',
      date: new Date('2024-05-15'),
      prio: '',
    },
    {
      id: 5,
      title: 'Check classes on dragging',
      subtitle: 'Classes are wrong by drag n drop',
      content: 'Check functions and classes',
      date: new Date('2024-06-01'),
      prio: 'low',
    },
  ];

  done: Task[] = [
    {
      id: 6,
      title: 'Design Board',
      subtitle: 'Make the Layout and css classes',
      content: 'Pay attention to class naming',
      date: new Date('2024-07-19'),
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

  /**
   * checks the priority and sets the right class for color highlighting
   * @param prio 
   * @returns 
   */
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
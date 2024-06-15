import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ThemesComponent } from '../../services/themes/themes.component';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TooltipPosition } from '@angular/material/tooltip';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarsComponent } from '../snackbars/snackbars.component';
import { BehaviorSubject } from 'rxjs';

interface Task {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  date: Date;
  prio: string;
  done: Boolean;
  status: 'urgent' | 'todo' | 'inProgress' | 'done';
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
  doneCount$: BehaviorSubject<number>;
  urgentCount$: BehaviorSubject<number>;
  inProgressCount$: BehaviorSubject<number>;
  todoCount$: BehaviorSubject<number>;
  overdueCount$: BehaviorSubject<number>;

  constructor(
    private themesComponent: ThemesComponent,
    private router: Router,
    public dialog: MatDialog,
    private snackbarsComponent: SnackbarsComponent,
    private cdr: ChangeDetectorRef
  ) {
    this.doneCount$ = new BehaviorSubject<number>(this.done.length);
    this.urgentCount$ = new BehaviorSubject<number>(this.urgent.length);
    this.inProgressCount$ = new BehaviorSubject<number>(this.inProgress.length);
    this.todoCount$ = new BehaviorSubject<number>(this.todo.length);
    this.overdueCount$ = new BehaviorSubject<number>(this.getOverdueCount());
  }

  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  position = new FormControl(this.positionOptions[0]);

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

  /**
   * format the date object
   * @param date
   * @returns
   */
  getFormattedDate(date: Date): string {
    return (
      date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear()
    );
  }

  /**
   * shows delete task dialog
   */
  deleteTaskDialog() {
    this.snackbarsComponent.openSnackBar('Task deleted', false, false);
  }

  /**
   * shows edit task dialog
   */
  editTaskDialog() {
    this.snackbarsComponent.openSnackBar('Task edited', false, false);
  }

  /**
   * shows add task dialog
   */
  addTaskDialog() {
    this.snackbarsComponent.openSnackBar('Task created', true, false);
  }

  /**
   * shows done task dialog
   */
  doneTaskDialog() {
    this.snackbarsComponent.openSnackBar('Task finished - moved to done!', true, false);
  }


  /**
   * default tasks
   */
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
      done: false,
      status: 'todo',
    },
    {
      id: 2,
      title: 'Start with Django',
      subtitle: 'Install and prepare',
      content: 'Install REST framework, set up venv, check requirements',
      date: new Date('2024-08-06'),
      prio: 'medium',
      done: false,
      status: 'todo',
    },
    {
      id: 3,
      title: 'Testing theming',
      subtitle: 'Check all themes: light, dark and default',
      content: 'very fiddly thing to make work',
      date: new Date('2024-06-23'),
      prio: 'low',
      done: false,
      status: 'todo',
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
      done: false,
      status: 'inProgress',
    },
    {
      id: 5,
      title: 'Check classes on dragging',
      subtitle: 'Classes are wrong by drag n drop',
      content: 'Check functions and classes',
      date: new Date('2024-06-01'),
      prio: 'low',
      done: false,
      status: 'inProgress',
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
      done: false,
      status: 'done',
    },
  ];

  /**
   * drag and drop function from Angular
   * updateDoneCount method for update the cards count on done section
   * @param event
   * @returns
   */
  drop(event: CdkDragDrop<any[]>) {
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
    this.updateDoneCount();
    this.updateOverdueCount();
  }

  /**
   * updates the cards count
   */
  updateDoneCount() {
    this.doneCount$.next(this.done.length);
    this.urgentCount$.next(this.urgent.length);
    this.todoCount$.next(this.todo.length);
    this.inProgressCount$.next(this.inProgress.length);
    this.cdr.detectChanges();
  }

  /**
   * updates the overdue tasks count
   */
  updateOverdueCount() {
    this.overdueCount$.next(this.getOverdueCount());
    this.cdr.detectChanges();
  }

  /**
   * Returns the count of overdue tasks
   */
  getOverdueCount(): number {
    return (
      this.urgent.filter((task) => this.isDateOverdue(task.date)).length +
      this.todo.filter((task) => this.isDateOverdue(task.date)).length +
      this.inProgress.filter((task) => this.isDateOverdue(task.date)).length +
      this.done.filter((task) => this.isDateOverdue(task.date)).length
    );
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

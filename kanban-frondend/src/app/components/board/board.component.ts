// src/app/components/board/board.component.ts

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
import { TaskServiceComponent } from '../../services/task-service/task-service.component';


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
    private cdr: ChangeDetectorRef,
    public taskService: TaskServiceComponent
  ) {
    this.doneCount$ = this.taskService.doneCount$;
    this.urgentCount$ = this.taskService.urgentCount$;
    this.inProgressCount$ = this.taskService.inProgressCount$;
    this.todoCount$ = this.taskService.todoCount$;
    this.overdueCount$ = this.taskService.overdueCount$;
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

  setTemporaryOverflowHidden() {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }

  restoreOverflow() {
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
  }

  onLogout() {
    this.triggerLogOutOverlay();
  }

  onThemeChange(selectedTheme: string) {
    this.themesComponent.onThemeChange(selectedTheme);
  }

  deleteTaskDialog() {
    this.snackbarsComponent.openSnackBar('Task deleted', false, false);
  }

  editTaskDialog() {
    this.snackbarsComponent.openSnackBar('Task edited', false, false);
  }

  addTaskDialog() {
    this.snackbarsComponent.openSnackBar('Task created', true, false);
  }

  doneTaskDialog() {
    this.snackbarsComponent.openSnackBar('Task finished - moved to done!', true, false);
  }

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
    this.taskService.updateCounts();
  }
}
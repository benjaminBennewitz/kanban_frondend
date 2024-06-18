// src/app/services/task/task.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SnackbarsComponent } from '../../components/snackbars/snackbars.component';

interface Task {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  date: Date;
  prio: string;
  done: Boolean;
  status: 'urgent' | 'todo' | 'inProgress' | 'done';
  showDatePicker?: boolean;
  isEditMode?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TaskServiceComponent {

  showDatePicker: boolean = false;

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
   * BehaviorSubjects for tracking task counts
   */
  doneCount$ = new BehaviorSubject<number>(this.done.length);
  urgentCount$ = new BehaviorSubject<number>(this.urgent.length);
  inProgressCount$ = new BehaviorSubject<number>(this.inProgress.length);
  todoCount$ = new BehaviorSubject<number>(this.todo.length);
  overdueCount$ = new BehaviorSubject<number>(this.getOverdueCount());

  constructor(private snackbarsComponent: SnackbarsComponent) {}

  /**
   * main funciton for calculating the past date
   * @param date 
   * @returns 
   */
  isDatePast(date: Date): boolean {
    const today = new Date();
    return date < today;
  }

  /**
   * help funciton to return the past date
   * @param date 
   * @returns 
   */
  isDateOverdue(date: Date): boolean {
    return this.isDatePast(date);
  }

  /**
   * date function when input value is change
   * @param event 
   * @param task 
   */
  onDateChange(event: Event, task: Task): void {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      task.date = new Date(input.value);
    }
  }

  /**
   * count the tasks state
   * @returns 
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
   * toogles the edit mode for each task
   * @param task 
   */
  toggleEditMode(task: Task) {
    task.isEditMode = !task.isEditMode;
  }

  /**
   * checks the prio state and returns it
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

  /**
   * updates the correct count when tasks change the column
   */
  updateCounts() {
    this.doneCount$.next(this.done.length);
    this.urgentCount$.next(this.urgent.length);
    this.todoCount$.next(this.todo.length);
    this.inProgressCount$.next(this.inProgress.length);
    this.overdueCount$.next(this.getOverdueCount());
  }

  /**
   * Deletes a task from the respective list
   * @param taskId ID of the task to be deleted
   */
  deleteTask(taskId: number): void {
    this.urgent = this.urgent.filter(task => task.id !== taskId);
    this.todo = this.todo.filter(task => task.id !== taskId);
    this.inProgress = this.inProgress.filter(task => task.id !== taskId);
    this.done = this.done.filter(task => task.id !== taskId);
    // Update counts
    this.updateCounts();
    // Show Snackbar
    this.snackbarsComponent.openSnackBar('Task deleted', false, false);
  }

  /**
   * Marks a task as done and moves it to the 'done' array
   * @param taskId ID of the task to be marked as done
   */
  taskDone(taskId: number): void {
    // Finde den Task, der verschoben werden soll
    const taskToMove = this.findTaskById(taskId);

    if (taskToMove) {
      // Entferne den Task aus dem aktuellen Array
      this.removeFromCurrentArray(taskToMove);
      // Füge den Task zum 'done' Array hinzu
      this.done.push(taskToMove);
      // Update die Zähler
      this.updateCounts();
      // Show Snackbar
      this.snackbarsComponent.openSnackBar('Task finished - moved to done!', true, false);
    }
  }
  
  /**
   * Hilfsfunktion, um einen Task anhand seiner ID zu finden
   * @param taskId ID des gesuchten Tasks
   * @returns Der gefundene Task oder null, wenn nicht gefunden
   */
  private findTaskById(taskId: number): Task | null {
    const allTasks = [...this.urgent, ...this.todo, ...this.inProgress, ...this.done];
    return allTasks.find(task => task.id === taskId) || null;
  }

  /**
   * Hilfsfunktion, um einen Task aus dem aktuellen Array zu entfernen
   * @param taskToRemove Der Task, der entfernt werden soll
   */
  private removeFromCurrentArray(taskToRemove: Task): void {
    this.urgent = this.removeFromTaskArray(this.urgent, taskToRemove);
    this.todo = this.removeFromTaskArray(this.todo, taskToRemove);
    this.inProgress = this.removeFromTaskArray(this.inProgress, taskToRemove);
    // Der Task wird aus dem aktuellen Array entfernt, daher ist keine Aktion erforderlich
  }

  /**
   * Hilfsfunktion, um einen Task aus einem Array zu entfernen
   * @param array Das Array, aus dem der Task entfernt werden soll
   * @param taskToRemove Der Task, der entfernt werden soll
   * @returns Ein neues Array ohne den entfernten Task
   */
  private removeFromTaskArray(array: Task[], taskToRemove: Task): Task[] {
    return array.filter(task => task.id !== taskToRemove.id);
  }
}
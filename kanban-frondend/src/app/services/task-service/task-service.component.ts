import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SnackbarsComponent } from '../../components/snackbars/snackbars.component';
import { AddTaskDialogComponent } from '../../components/add-task-dialog/add-task-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TimerClickerComponent } from '../timer-clicker/timer-clicker.component';

export interface Task {
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
  doTime: number;
}

@Injectable({
  providedIn: 'root',
})

export class TaskServiceComponent {
  // variables for the timer
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();
  // toogle between true and fals for the calendar icon
  showDatePicker: boolean = false;

  urgent: Task[] = [];
  todo: Task[] = [];
  inProgress: Task[] = [];
  done: Task[] = [];

   /**
   * @param snackbarsComponent 
   * @param dialog 
   */
   constructor(
    private snackbarsComponent: SnackbarsComponent,
    private dialog: MatDialog,
    private timerService: TimerClickerComponent) {}


  // default tasks for testing
  /*urgent: Task[] = [
    {
      id: 3,
      title: 'Testing theming',
      subtitle: 'Check all themes: light, dark and default',
      content: 'very fiddly thing to make work',
      date: new Date('2024-06-23'),
      prio: 'low',
      done: false,
      status: 'todo',
      doTime: 0,
    },
  ];
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
      doTime: 0,
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
      doTime: 0,
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
      doTime: 0,
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
      doTime: 0,
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
      doTime: 0,
    },
  ];*/

  /**
   * BehaviorSubjects for tracking task counts
   */
  doneCount$ = new BehaviorSubject<number>(this.done.length);
  urgentCount$ = new BehaviorSubject<number>(this.urgent.length);
  inProgressCount$ = new BehaviorSubject<number>(this.inProgress.length);
  todoCount$ = new BehaviorSubject<number>(this.todo.length);
  overdueCount$ = new BehaviorSubject<number>(this.getOverdueCount());

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
    if (!task.isEditMode) {
      this.snackbarsComponent.openSnackBar('Task edited', false, false);
    }
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
   * opens the add Task dialog
   */
  addTaskDialog(state:string): void {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '400px',
      data: { title: '', subtitle: '', content: '', date: new Date(), prio:'low', status: state }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newTask: Task = {
          id: this.generateUniqueId(),
          title: result.title,
          subtitle: result.subtitle,
          content: result.content,
          date: new Date(result.date),
          prio: result.prio || '',
          done: false,
          status: result.status,
          isEditMode: false,
          doTime:0,
        };
        this.addTaskToCorrectArray(newTask);
        this.snackbarsComponent.openSnackBar('Task created', true, false);
      }
    });
  }

  /**
   * generate and returns a unique id for each new task
   * @returns 
   */
  generateUniqueId(): number {
    const allTasks = [...this.urgent, ...this.todo, ...this.inProgress, ...this.done];
    return Math.max(...allTasks.map(task => task.id)) + 1;
  }

  /**
   * pushes the task in the right array, checks the value of input from add task dialog
   * @param task 
   */
  addTaskToCorrectArray(task: Task): void {
    switch (task.status) {
      case 'urgent':
        this.urgent.push(task);
        break;
      case 'todo':
        this.todo.push(task);
        break;
      case 'inProgress':
        this.inProgress.push(task);
        break;
      case 'done':
        this.done.push(task);
        break;
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
    this.updateCounts();
    this.snackbarsComponent.openSnackBar('Task deleted', false, false);
  }

  /**
   * Marks a task as done and moves it to the 'done' array
   * @param taskId ID of the task to be marked as done
   */
  taskDone(taskId: number): void {
    const taskToMove = this.findTaskById(taskId);

    if (taskToMove && taskToMove.status !== 'done') {
      const elapsedTimeInMinutes = this.timerService.currentMinutes + this.timerService.currentSeconds / 60;

      taskToMove.doTime = elapsedTimeInMinutes;
      taskToMove.status = 'done';

      this.removeFromCurrentArray(taskToMove);
      this.done.push(taskToMove);
      this.updateCounts();
      this.timerService.pauseTimer();
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
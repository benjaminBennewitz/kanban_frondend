import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SnackbarsComponent } from '../../components/snackbars/snackbars.component';
import { AddTaskDialogComponent } from '../../components/add-task-dialog/add-task-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

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
  // variable for the url
  private apiUrl = 'http://localhost:8000/tasks/';
  // variables for the task counts
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();
  // toogle between true and fals for the calendar icon
  showDatePicker: boolean = false;
  // see default arrays in tests.ts
  urgent: Task[] = [];
  todo: Task[] = [];
  inProgress: Task[] = [];
  done: Task[] = [];

  // BehaviorSubjects for tracking task counts
  doneCount$ = new BehaviorSubject<number>(0);
  urgentCount$ = new BehaviorSubject<number>(0);
  inProgressCount$ = new BehaviorSubject<number>(0);
  todoCount$ = new BehaviorSubject<number>(0);
  overdueCount$ = new BehaviorSubject<number>(0);

  constructor(
    private snackbarsComponent: SnackbarsComponent,
    private dialog: MatDialog,
    private http: HttpClient
  ) {}

  /**
   * load the tasks from backend
   * sorts the tasks into the right arrays
   * updates the tasks counts
   */
  loadTasksFromBackend(): void {
    this.http.get<Task[]>(this.apiUrl).subscribe(
      (tasks) => {
        this.tasksSubject.next(tasks);
        this.sortTasksIntoArrays(tasks);
        this.updateTaskCounts();
      },
      (error) => {
        console.error('Error while loading tasks:', error);
        this.snackbarsComponent.openSnackBar(
          'Error while loading tasks',
          false,
          false
        );
      }
    );
  }

  /**
   * sorts the tasks into the right array
   * @param tasks
   */
  private sortTasksIntoArrays(tasks: Task[]): void {
    this.urgent = tasks.filter((task) => task.status === 'urgent');
    this.todo = tasks.filter((task) => task.status === 'todo');
    this.inProgress = tasks.filter((task) => task.status === 'inProgress');
    this.done = tasks.filter((task) => task.status === 'done');
    this.updateOverdueCount();
    this.updateTaskCounts();
  }

  updateTaskCounts(): void {
    this.doneCount$.next(this.done.length);
    this.urgentCount$.next(this.urgent.length);
    this.inProgressCount$.next(this.inProgress.length);
    this.todoCount$.next(this.todo.length);
  }

  updateOverdueCount(): void {
    const overdueCount = this.getOverdueCount();
    this.overdueCount$.next(overdueCount);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }



  /* ################################### */
  /* ######   CRUD OPERATIONS   ####### */
  /* ################################# */


  updateTask(task: Task): Observable<Task> {
    const url = `${this.apiUrl}${task.id}/`;
    return this.http.put<Task>(url, task);
  }  

  /**
   * deletes a task
   * @param taskId
   */
  deleteTask(taskId: number): void {
    const url = `${this.apiUrl}${taskId}/`;

    this.http.delete<void>(url).subscribe(
      () => {
        this.removeFromAllArrays(taskId);
        this.updateTaskCounts();
        this.updateOverdueCount();
        this.snackbarsComponent.openSnackBar('Task deleted', true, false);
      },
      (error) => {
        console.error('Error deleting task:', error);
        this.snackbarsComponent.openSnackBar('Error deleting task', false, false);
      }
    );
  }

  /**
   * Helper function to remove a task from all arrays.
   * @param taskId The ID of the task to remove.
   */
  private removeFromAllArrays(taskId: number): void {
    this.urgent = this.urgent.filter((task) => task.id !== taskId);
    this.todo = this.todo.filter((task) => task.id !== taskId);
    this.inProgress = this.inProgress.filter((task) => task.id !== taskId);
    this.done = this.done.filter((task) => task.id !== taskId);
  }

  /**
   * main function for calculating the past date
   * @param date
   * @returns
   */
  isDatePast(date: Date | string): boolean {
    const today = new Date();
    const taskDate = new Date(date);
    // Set the time of today's date to 00:00:00 to compare only the date part
    today.setHours(0, 0, 0, 0);
    return taskDate < today;
  }

  /**
   * help function to return the past date
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
      this.updateOverdueCount();
    }
  }

  /**
   * count the tasks state
   * @returns
   */
  private getOverdueCount(): number {
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
      this.updateTask(task).subscribe(
        () => {
          this.snackbarsComponent.openSnackBar('Task edited', true, false);
        },
        (error) => {
          console.error('Error while updating task:', error);
          this.snackbarsComponent.openSnackBar('Error while updating task', false, false);
        }
      );
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
  addTaskDialog(state: string): void {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '400px',
      data: {
        title: '',
        subtitle: '',
        content: '',
        date: new Date(),
        prio: 'low',
        status: state,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
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
          doTime: 0,
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
    const allTasks = [
      ...this.urgent,
      ...this.todo,
      ...this.inProgress,
      ...this.done,
    ];
    return Math.max(...allTasks.map((task) => task.id)) + 1;
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
   * Marks a task as done and moves it to the 'done' array
   * @param taskId ID of the task to be marked as done
   */
  taskDone(taskId: number): void {
    const taskToMove = this.findTaskById(taskId);

    if (taskToMove && taskToMove.status !== 'done') {
      taskToMove.status = 'done';
      this.removeFromCurrentArray(taskToMove);
      this.done.push(taskToMove);
      this.updateCounts();
      this.snackbarsComponent.openSnackBar(
        'GREAT! - Task is done',
        true,
        false
      );
    }
  }

  /**
   * Helper function to find a task by its ID.
   * @param taskId The ID of the task to find.
   * @returns The found task or null if not found.
   */
  private findTaskById(taskId: number): Task | null {
    const allTasks = [
      ...this.urgent,
      ...this.todo,
      ...this.inProgress,
      ...this.done,
    ];
    return allTasks.find((task) => task.id === taskId) || null;
  }

  /**
   * Helper function to remove a task from the current array.
   * @param taskToRemove The task to be removed.
   */
  private removeFromCurrentArray(taskToRemove: Task): void {
    this.urgent = this.removeFromTaskArray(this.urgent, taskToRemove);
    this.todo = this.removeFromTaskArray(this.todo, taskToRemove);
    this.inProgress = this.removeFromTaskArray(this.inProgress, taskToRemove);
    this.done = this.removeFromTaskArray(this.done, taskToRemove);
  }

  /**
   * Helper function to remove a task from an array.
   * @param {Array<any>} array The array from which the task should be removed.
   * @param {*} taskToRemove The task to be removed from the array.
   * @returns {Array<any>} A new array without the removed task.
   */
  private removeFromTaskArray(array: Task[], taskToRemove: Task): Task[] {
    return array.filter((task) => task.id !== taskToRemove.id);
  }
}

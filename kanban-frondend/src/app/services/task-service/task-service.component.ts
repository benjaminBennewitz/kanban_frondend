import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SnackbarsComponent } from '../../components/snackbars/snackbars.component';
import { AddTaskDialogComponent } from '../../components/add-task-dialog/add-task-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TimerClickerComponent } from '../timer-clicker/timer-clicker.component';

export interface Task {
  id?: number;
  title: string;
  subtitle: string;
  content: string;
  date: Date;
  prio: string;
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
    private http: HttpClient,
    private timerService: TimerClickerComponent,
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
        this.snackbarsComponent.openSnackBar('Error while loading tasks', false, false);
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

  /**
   * Updates the counts for done, urgent, in-progress, and to-do tasks.
   * This method updates the respective observables with the current lengths of each task array.
   */
  updateTaskCounts(): void {
    this.doneCount$.next(this.done.length);
    this.urgentCount$.next(this.urgent.length);
    this.inProgressCount$.next(this.inProgress.length);
    this.todoCount$.next(this.todo.length);
  }

  /**
   * Updates the count of overdue tasks.
   * This method calculates the overdue tasks and updates the overdueCount$ observable.
   */
  updateOverdueCount(): void {
    const overdueCount = this.getOverdueCount();
    this.overdueCount$.next(overdueCount);
  }

  /* ################################### */
  /* ######   CRUD OPERATIONS   ####### */
  /* ################################# */

  /**
   * Creates a new task.
   * Sends a POST request to the API to create a new task and returns an observable of the created task.
   * see also the addTaskDialog() method LoC 276
   * @returns {Observable<Task>} An observable of the created task.
   */
  createTask(newTask: Task): Observable<Task> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Token ${localStorage.getItem('token')}`,
    });
    return this.http.post<Task>(`${this.apiUrl}create/`, newTask, { headers });
  }

  /**
   * Updates a task.
   * checks the date is an object
   * Converts the date to a string format before sending it to the backend.
   * @param task - The task to be updated.
   * @returns An Observable of the updated task.
   */
  updateTask(task: Task): Observable<Task> {
    const url = `${this.apiUrl}${task.id}/`;
    // Ensure task.date is a Date object
    let taskDate = task.date;
    if (!(taskDate instanceof Date)) {
      taskDate = new Date(taskDate);
    }
    // Format the date as ISO string (YYYY-MM-DD)
    const taskToSend = { ...task, date: taskDate.toISOString().split('T')[0] };
    return this.http.put<Task>(url, taskToSend);
  }

  /**
   * helper function for update only the status by drag n drop
   * has its own view, serializer and url
   */
  updateTaskStatus(taskId: number, status: string): Observable<any> {
    const url = `${this.apiUrl}${taskId}/status/`;
    const body = { status: status };
    return this.http.put<Task>(url, body);
  }

   /**
   * helper function for update only the doTime
   */
  updateTaskWithTime(taskId: number, status: string, doTime: number): Observable<Task> {
    const updateData = {
      status: status,
      doTime: doTime
    };
    return this.http.patch<Task>(`${this.apiUrl}${taskId}/status/`, updateData);
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

  /* ################################### */
  /* ######   HELPER FUNCTIONS  ####### */
  /* ################################# */

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
    const newDate = input.value;

    if (newDate) {
      const parsedDate = new Date(newDate);
      if (!isNaN(parsedDate.getTime())) {
        task.date = parsedDate;
        this.updateOverdueCount();
      }
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
   * toogles the edit mode for each task
   * @param task
   */
  toggleEditMode(task: Task) {
    task.isEditMode = !task.isEditMode;
    if (!task.isEditMode) {
      this.updateTask(task).subscribe(
        () => {
          this.loadTasksFromBackend();
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
   * Marks a task as done and moves it to the 'done' array
   * @param taskId ID of the task to be marked as done
   */
  moveTaskToDone(taskId: number): void {
    const taskToMove = this.findTaskById(taskId);
  
    if (taskToMove && taskToMove.status !== 'done') {
      taskToMove.status = 'done';
  
      const doTimeInMinutes = this.timerService.getCurrentTimeInMinutes();
      taskToMove.doTime = Math.ceil(doTimeInMinutes);
  
      this.removeFromCurrentArray(taskToMove);
      this.done.push(taskToMove);
      this.updateCounts();
  
      this.updateTaskWithTime(taskId, 'done', taskToMove.doTime).subscribe(
        (updatedTask) => {
          this.snackbarsComponent.openSnackBar('GREAT! - Task is done', true, false);
        },
        (error) => {
          console.error('Failed to update task status - clicked on checked:', error);
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
          title: result.title,
          subtitle: result.subtitle,
          content: result.content,
          date: result.date.toISOString().split('T')[0],
          prio: result.prio || 'low',
          status: result.status,
          doTime: 0,
        };
        this.createTask(newTask).subscribe(
          (createdTask) => {
            console.log('Task erstellt:', createdTask);
            this.snackbarsComponent.openSnackBar('Task created', true, false);
            this.loadTasksFromBackend();
          },
          (error) => {
            console.error('Fehler beim Erstellen der Aufgabe:', error);
            this.snackbarsComponent.openSnackBar('Error while creating the task', false, false);
          }
        );
      }
    });
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
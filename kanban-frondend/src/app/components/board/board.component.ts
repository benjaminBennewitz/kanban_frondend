import { Component, OnInit, ChangeDetectorRef, ViewChildren, ElementRef, AfterViewInit, OnDestroy, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { ThemesComponent } from '../../services/themes/themes.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TooltipPosition } from '@angular/material/tooltip';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Task, TaskServiceComponent } from '../../services/task-service/task-service.component';
import { MascotComponent } from '../../services/mascot/mascot.component';
import { TimerClickerComponent } from '../../services/timer-clicker/timer-clicker.component';
import { AuthComponent } from '../../services/auth/auth.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  
})
export class BoardComponent implements OnInit, AfterViewInit, OnDestroy   {
  
  urgentTasks: Task[] = [];
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];

  tasks: Task[] = [];

  showFiller = false;
  currentTheme: string = 'default';
  /* OVERLAY ANIMATIONS VARIABLES*/
  hideWelcomeOverlay = false;
  hideLogOutOverlay = true;
  /* TASK OVERWIEV VARIABLES (HUD)*/
  doneCount$: BehaviorSubject<number>;
  urgentCount$: BehaviorSubject<number>;
  inProgressCount$: BehaviorSubject<number>;
  todoCount$: BehaviorSubject<number>;
  overdueCount$: BehaviorSubject<number>;
  /* CHANGE THE HEIGHT FOR TEXTAREA VARIABLE */
  @ViewChildren('contentTextarea') contentTextareas!: QueryList<ElementRef>;
  /* MASCOT CARLY VARIABLES */
  mascotTexts: any[] = [];
  currentText: string = '';
  private intervalId: any;
  private subscriptions: Subscription[] = [];
  allTasksLeft: number = 0;
  showMascotDialog: boolean = false;
  /* TIMER VARIABLES */
  minutes: number = 0;
  seconds: number = 0;
  milliseconds: number = 0;
  isRunning: boolean = false;
  showClicker: boolean = true;
  private timerSubscription: Subscription = new Subscription();
  private isRunningSubscription: Subscription = new Subscription();
  private millisecondsSubscription: Subscription = new Subscription();
  /* CARLY TOOGLE VARIABLES*/
  checkedCarly = true;
  checkedClicker = true;
  disabled = false;
  /* USERNAME VARIABLE FOR WELCOME MESSAGE */
  username: string = '';

  constructor(
    private themesComponent: ThemesComponent,
    private router: Router,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public taskService: TaskServiceComponent,
    private mascotService: MascotComponent,
    public timerService: TimerClickerComponent,
    private as: AuthComponent,
  ) {
    this.doneCount$ = this.taskService.doneCount$;
    this.urgentCount$ = this.taskService.urgentCount$;
    this.inProgressCount$ = this.taskService.inProgressCount$;
    this.todoCount$ = this.taskService.todoCount$;
    this.overdueCount$ = this.taskService.overdueCount$;
  }

  // tooltip positions
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  position = new FormControl(this.positionOptions[0]);

  // onload functions
  ngOnInit() :void{
    // load tasks from backend
    this.taskService.loadTasksFromBackend();

    // get username and use in board.html
    this.username = localStorage.getItem('username') || '';

    // get the current theme
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

    // Subscribe to changes in counts and update mascot texts accordingly
    this.subscriptions.push(this.taskService.doneCount$.subscribe(() => this.updateMascotTexts()));
    this.subscriptions.push(this.taskService.urgentCount$.subscribe(() => this.updateMascotTexts()));
    this.subscriptions.push(this.taskService.inProgressCount$.subscribe(() => this.updateMascotTexts()));
    this.subscriptions.push(this.taskService.todoCount$.subscribe(() => this.updateMascotTexts()));
    this.subscriptions.push(this.taskService.overdueCount$.subscribe(() => this.updateMascotTexts()));

    // Change the message every minute
    this.intervalId = setInterval(() => {
      this.changeMessage();
      this.showMascotDialog = true; // shows the mascotDialog
      setTimeout(() => {
        this.showMascotDialog = false; // hide the mascotDialog after 5 seconds
        this.cdr.detectChanges(); // detect texts changes
      }, 10000);
    }, 60000); // 60000 ms = 1 minute

    // initialize first message and mascotDialog
    this.changeMessage();
    setTimeout(() => {
      this.showMascotDialog = true; // shows the mascotDialog
      setTimeout(() => {
        this.showMascotDialog = false; // hide the mascotDialog after 5 seconds
        this.cdr.detectChanges(); // detect texts changes
      }, 10000);
    }, 15000); // 15000 ms = 15 Sekunden

     // TIMER
     this.timerSubscription = this.timerService.seconds$.subscribe(seconds => this.seconds = seconds);
     this.isRunningSubscription = this.timerService.isRunning$.subscribe(isRunning => this.isRunning = isRunning);
     this.millisecondsSubscription = this.timerService.milliseconds$.subscribe(milliseconds => this.milliseconds = milliseconds);
   }

  /**
   * unsubscribe from carly texts interval and timer
   */
  ngOnDestroy(): void {
    // Clear interval when component is destroyed
    clearInterval(this.intervalId);
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * updates the texts from mascot array
   */
  updateMascotTexts(): void {
    const counts = {
      doneCount: this.taskService.doneCount$.value,
      urgentCount: this.taskService.urgentCount$.value,
      inProgressCount: this.taskService.inProgressCount$.value,
      todoCount: this.taskService.todoCount$.value,
      overdueCount: this.taskService.overdueCount$.value,
      allTasksLeft: this.calculateAllTasksLeft()
    };
    this.mascotTexts = this.mascotService.getMascotTexts(counts);
  }

  /**
   * change the text of the mascotDialog
   */
  changeMessage(): void {
    if (this.mascotTexts.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.mascotTexts.length);
      this.currentText = this.mascotTexts[randomIndex].text;
      this.cdr.detectChanges();
    }
  }

  /**
   * helper function to return the sum of all left over tasks
   * @returns 
   */
  calculateAllTasksLeft(): number {
    return this.taskService.urgentCount$.value +
           this.taskService.todoCount$.value +
           this.taskService.inProgressCount$.value;
  }

  /**
   * hides the textbox
   */
  hideMascotDialog(): void {
    this.showMascotDialog = false;
    this.cdr.detectChanges(); // forces an update to the view
  }  

  /**
   * toogles on/off for the mascot
   */
  toggleMascotDialog(): void {
    if (this.checkedCarly) {
      this.showMascotDialog = true;
      this.changeMessage();
      setTimeout(() => {
        this.hideMascotDialog();
      }, 5000);
    } else {
      this.showMascotDialog = false;
    }
  }  

  /**
   * toogles on/off for the clicker
   */
  toggleClickerVisibility(): void {
    if (this.checkedClicker) {
      this.showClicker = true;
    } else {
      this.showClicker = false;
    }
  } 

  /**
   * calls the adjustTextareaHeight function
   */
  ngAfterViewInit(): void {
    this.adjustTextareaHeight();
  }

  /**
   * calls the adjustTextareaHeight function
   */
  ngAfterViewChecked(): void {
    this.adjustTextareaHeight();
  }

  /**
   * changes the height of the textareas of the tasks
   */
  adjustTextareaHeight(): void {
    this.contentTextareas.forEach((textareaRef: ElementRef) => {
      const textarea = textareaRef.nativeElement;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    });
  }

  /**
   * calls the adjustTextareaHeight function after inputs to set the right height aggain
   */
  onInput(): void {
    this.adjustTextareaHeight();
  }

  /**
   * shows the welcome overlay container/animation
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
   * shows the log out container/animation
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
   * help function to hide ervery scrollbar during the overlay animations
   */
  setTemporaryOverflowHidden() {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }

  /**
   * help function to restore the scrollbar settings after the overlay animations
   */
  restoreOverflow() {
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
  }

  /**
   * cals the triggerLogOutOverlay() function
   * removes token by log out
   */
  onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.triggerLogOutOverlay();
  }

  /**
   * sets the selected theme
   * @param selectedTheme 
   */
  onThemeChange(selectedTheme: string) {
    this.themesComponent.onThemeChange(selectedTheme);
  }

  /**
   * ANGULAR function for dropping an element by drag & drop
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
    this.taskService.updateCounts();
    setTimeout(() => this.adjustTextareaHeight(), 0);
  }

/**
 * help function to set ngClasses for themeing
 * @param baseClass 
 * @returns 
 */
  getThemeClass(baseClass: string): string {
    switch (this.currentTheme) {
      case 'default':
        return `${baseClass}`;
      case 'light-theme':
        return `${baseClass}-light`;
      case 'dark-theme':
        return `${baseClass}-dark`;
      default:
        return `${baseClass}`;
    }
  }

  /**
   * play and pause toogle of timer
   */
  toggleTimer() {
    if (this.isRunning) {
      this.timerService.pauseTimer();
    } else {
      this.timerService.startTimer();
    }
  }

  /**
   * resets the timer
   */
  resetTimer() {
    this.timerService.resetTimer();
  }
}
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ThemesComponent } from '../../services/themes/themes.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TooltipPosition } from '@angular/material/tooltip';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarsComponent } from '../snackbars/snackbars.component';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TaskServiceComponent } from '../../services/task-service/task-service.component';
import { MascotComponent } from '../../services/mascot/mascot.component';

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
export class BoardComponent implements OnInit, AfterViewInit, OnDestroy   {
  showFiller = false;
  currentTheme: string = 'default';
  hideWelcomeOverlay = false;
  hideLogOutOverlay = true;
  doneCount$: BehaviorSubject<number>;
  urgentCount$: BehaviorSubject<number>;
  inProgressCount$: BehaviorSubject<number>;
  todoCount$: BehaviorSubject<number>;
  overdueCount$: BehaviorSubject<number>;
  @ViewChild('contentTextarea') contentTextarea?: ElementRef;
  mascotTexts: any[] = [];
  currentText: string = '';
  private intervalId: any;
  private subscriptions: Subscription[] = [];
  allTasksLeft: number = 0;
  showMascotDialog: boolean = false;

  checked = false;
  disabled = false;
  

  constructor(
    private themesComponent: ThemesComponent,
    private router: Router,
    public dialog: MatDialog,
    private snackbarsComponent: SnackbarsComponent,
    private cdr: ChangeDetectorRef,
    public taskService: TaskServiceComponent,
    private mascotService: MascotComponent,
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
    this.adjustTextareaHeight();

    // update function for mascot texts
   

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
  }

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
   * hepl function to return the sum of all left over tasks
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
    if (this.checked) {
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
   * calls the adjustTextareaHeight function
   */
  ngAfterViewInit(): void {
    this.adjustTextareaHeight();
  }

  /**
   * changes the height of the textareas of the tasks
   */
  adjustTextareaHeight(): void {
    if (this.contentTextarea) {
      const textarea = this.contentTextarea.nativeElement;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
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
   */
  onLogout() {
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
}
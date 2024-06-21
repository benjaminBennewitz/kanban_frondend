import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-timer-clicker',
  templateUrl: './timer-clicker.component.html',
  styleUrl: './timer-clicker.component.scss'
})
export class TimerClickerComponent {
  private millisecondsSubject = new BehaviorSubject<number>(0);
  private secondsSubject = new BehaviorSubject<number>(0);
  private minutesSubject = new BehaviorSubject<number>(0);
  private isRunning = new BehaviorSubject<boolean>(false);
  private intervalId: any;

  milliseconds$ = this.millisecondsSubject.asObservable();
  seconds$ = this.secondsSubject.asObservable();
  minutes$ = this.minutesSubject.asObservable();
  isRunning$ = this.isRunning.asObservable();

  /**
   * starts the timer
   */
  startTimer() {
    this.isRunning.next(true);
    this.intervalId = setInterval(() => {
      let milliseconds = this.millisecondsSubject.value + 10;
      let seconds = this.secondsSubject.value;
      let minutes = this.minutesSubject.value;

      if (milliseconds === 1000) {
        milliseconds = 0;
        seconds++;
        this.secondsSubject.next(seconds);
      }
      if (seconds === 60) {
        seconds = 0;
        minutes++;
        this.minutesSubject.next(minutes);
      }
      this.millisecondsSubject.next(milliseconds);
    }, 10);
  }

  /**
   * pauses the timer
   */
  pauseTimer() {
    this.isRunning.next(false);
    clearInterval(this.intervalId);
  }

  /**
   * resets the timer
   */
  resetTimer() {
    this.pauseTimer();
    this.millisecondsSubject.next(0);
    this.secondsSubject.next(0);
    this.minutesSubject.next(0);
  }
}
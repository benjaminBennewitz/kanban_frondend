import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-timer-clicker',
  templateUrl: './timer-clicker.component.html',
  styleUrls: ['./timer-clicker.component.scss'],
})
export class TimerClickerComponent implements OnDestroy {
  private millisecondsSubject = new BehaviorSubject<number>(0);
  private secondsSubject = new BehaviorSubject<number>(0);
  private minutesSubject = new BehaviorSubject<number>(0);
  private isRunning = new BehaviorSubject<boolean>(false);
  private intervalId: any;
  private alive = true; // Flag to control the timer

  milliseconds$ = this.millisecondsSubject.asObservable();
  seconds$ = this.secondsSubject.asObservable();
  minutes$ = this.minutesSubject.asObservable();
  isRunning$ = this.isRunning.asObservable();

  constructor() {}

  ngOnDestroy(): void {
    this.pauseTimer();
  }

  /**
   * Getter property to retrieve the current value of milliseconds.
   * @returns The current value of milliseconds.
   */
  get currentMilliseconds() {
    return this.millisecondsSubject.value;
  }

  /**
   * Getter property to retrieve the current value of seconds.
   * @returns The current value of seconds.
   */
  get currentSeconds() {
    return this.secondsSubject.value;
  }

  /**
   * Getter property to retrieve the current value of minutes.
   * @returns The current value of minutes.
   */
  get currentMinutes() {
    return this.minutesSubject.value;
  }

  /**
   * Getter property to retrieve the current running state.
   * @returns The current running state (true if running, false otherwise).
   */
  get running() {
    return this.isRunning.value;
  }

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
        this.secondsSubject.next(0);
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

import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackMsgComponent } from '../snack-msg/snack-msg.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-snackbars',
  templateUrl: './snackbars.component.html',
  styleUrls: ['./snackbars.component.scss']
})
export class SnackbarsComponent {

  constructor(private snackBar: MatSnackBar, private router: Router) {}

  durationInSeconds = 3000;

  /**
   * snackbar object for showing dynamic snackbars
   * @param message 
   * @param showIcon 
   * @param showSpinner 
   */
  openSnackBar(message: string, showIcon: boolean = true, showSpinner: boolean = true) {
    this.snackBar.openFromComponent(SnackMsgComponent, {
      data: {
        message: message,
        showIcon: showIcon,
        showSpinner: showSpinner
      },
      duration: 2500
    });
  }
}
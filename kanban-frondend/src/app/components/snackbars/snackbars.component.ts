import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackMsgComponent } from '../snack-msg/snack-msg.component';

@Component({
  selector: 'app-snackbars',
  templateUrl: './snackbars.component.html',
  styleUrl: './snackbars.component.scss'
})
export class SnackbarsComponent {

  constructor(private _snackBar: MatSnackBar) {}

  durationInSeconds = 500000;

  openSnackBar(message: string) {
    this._snackBar.openFromComponent(SnackMsgComponent, {
      duration: this.durationInSeconds,
      data: { message: message }
    });
  }
}
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

  constructor(private _snackBar: MatSnackBar, private router: Router) {}

  durationInSeconds = 3000;

  // Function to open the snackbar with a message parameter and navigate after showing the snackbar
  openSnackBar(message: string) {
    const snackBarRef = this._snackBar.openFromComponent(SnackMsgComponent, {
      duration: this.durationInSeconds,
      data: { message: message }
    });

    // Wait for the snackbar to be dismissed before navigating
    snackBarRef.afterDismissed().subscribe(() => {
      this.router.navigate(['/board']);
    });
  }
}
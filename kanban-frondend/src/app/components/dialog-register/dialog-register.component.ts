import { Component } from '@angular/core';
import { SnackbarsComponent } from '../snackbars/snackbars.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-register',
  templateUrl: './dialog-register.component.html',
  styleUrl: './dialog-register.component.scss'
})
export class DialogRegisterComponent {

  constructor(public dialogRef: MatDialogRef<DialogRegisterComponent>) {}

  register() {
    // Perform registration logic here

    // Close the dialog and signal that registration was successful
    this.dialogRef.close('registered');
  }
}
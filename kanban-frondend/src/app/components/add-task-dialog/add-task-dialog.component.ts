// add-task-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
})

export class AddTaskDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AddTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  /**
   * close the dialog when clicking outside
   */
  onCancel(): void {
    this.dialogRef.close();
  }

  /**
   * saves the input values
   */
  onSave(): void {
    this.dialogRef.close(this.data);
  }
}
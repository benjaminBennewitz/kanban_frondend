import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snack-msg',
  templateUrl: './snack-msg.component.html',
  styleUrl: './snack-msg.component.scss'
})

export class SnackMsgComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}
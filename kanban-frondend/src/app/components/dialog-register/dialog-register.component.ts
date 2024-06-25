import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development'; // oder environment.production

@Component({
  selector: 'app-dialog-register',
  templateUrl: './dialog-register.component.html',
  styleUrls: ['./dialog-register.component.scss']
})
export class DialogRegisterComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  username: string = '';
  password: string = '';

  constructor(
    public dialogRef: MatDialogRef<DialogRegisterComponent>,
    private http: HttpClient
  ) {}

  /**
    * Function for registering a new user.
    * Sends a POST request to the backend with the user's registration details.
    * Closes the registration dialog and indicates success if the request is successful.
    * Displays an error message if the request fails.
    */
  register() {
    const body = {
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      username: this.username,
      password: this.password
    };

    this.http.post(`${environment.baseUrl}/register/`, body).subscribe({
      next: (response: any) => {
        this.dialogRef.close('registered');
      },
      error: (error: any) => {
        console.error('Registration failed', error);
        alert('Registration failed');
      }
    });
  }
}
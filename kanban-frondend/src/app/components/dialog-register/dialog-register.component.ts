import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidationComponent } from '../../services/form-validation/form-validation.component';

@Component({
  selector: 'app-dialog-register',
  templateUrl: './dialog-register.component.html',
  styleUrls: ['./dialog-register.component.scss']
})
export class DialogRegisterComponent {
  registerForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogRegisterComponent>,
    private fb: FormBuilder,
    private http: HttpClient,
    private validatorsService: FormValidationComponent,
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3), this.validatorsService.forbiddenCharactersValidator()]],
      lastName: ['', [Validators.required, Validators.minLength(3), this.validatorsService.forbiddenCharactersValidator()]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3), this.validatorsService.forbiddenCharactersValidator()]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  /**
    * Function for registering a new user.
    * Sends a POST request to the backend with the user's registration details.
    * Closes the registration dialog and indicates success if the request is successful.
    * Displays an error message if the request fails.
    */
  register() {
    if (this.registerForm.invalid) {
      return;
    }

    const body = {
      first_name: this.registerForm.value.firstName,
      last_name: this.registerForm.value.lastName,
      email: this.registerForm.value.email,
      username: this.registerForm.value.username,
      password: this.registerForm.value.password
    };

    this.http.post(`${environment.baseUrl}/register/`, body).subscribe({
      next: (_response: any) => {
        this.dialogRef.close('registered');
      },
      error: (error: any) => {
        console.error('Registration failed', error);
        alert('Registration failed');
      }
    });
  }
}
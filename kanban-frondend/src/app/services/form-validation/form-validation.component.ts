import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-form-validation',
  templateUrl: './form-validation.component.html',
  styleUrl: './form-validation.component.scss'
})

@Injectable({
  providedIn: 'root'
})

export class FormValidationComponent {

  constructor() { }

  /**
   * form validation, checks for forbidden characters
   * @returns 
   */
  forbiddenCharactersValidator(): ValidatorFn {
    const forbidden = /<script>|<\/script>/i;
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbiddenChar = forbidden.test(control.value);
      return forbiddenChar ? { 'forbiddenCharacters': { value: control.value } } : null;
    };
  }
}
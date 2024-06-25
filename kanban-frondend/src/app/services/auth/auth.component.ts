import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthComponent {

  private usernameSource = new BehaviorSubject<string>('');
  currentUsername = this.usernameSource.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Sends a login request with the provided username and password.
   * @param username 
   * @param password 
   * @returns 
   */
  public loginWithUserAndPassword(username:string, password:string){
    const url = environment.baseUrl + '/login/';
    const body = {
      "username": username,
      "password": password
    }
    return lastValueFrom(this.http.post(url, body));
  }

  /**
   * Sets the current username in the authentication service.
   * @param username 
   */
  setUsername(username: string) {
    this.usernameSource.next(username);
  }
}
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthComponent {

  constructor(private http: HttpClient) { }

  public loginWithUserAndPassword(username:string, password:string){
    const url = environment.baseUrl + '/login/';
    const body = {
      "username": username,
      "password": password
    }
    return lastValueFrom(this.http.post(url, body));
  }
}
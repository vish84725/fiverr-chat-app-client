import { Injectable } from '@angular/core';
import { Http, Headers,  } from '@angular/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
const helper = new JwtHelperService();


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authToken: any;
  user: any;

  API_URL = environment.api_url;

  constructor(private http: Http) { }

  registerUser(user) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.API_URL+'/users/register', user, { headers: headers })
      .pipe(
        map((res => res.json()))
      );
  }

  authenticateUser(user) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.API_URL+'/users/authenticate', user, { headers: headers })
      .pipe(
        map((res => res.json()))
      );
  }

  getProfile() {
    this.loadToken();
    const headers = new Headers({
      'Content-Type':  'application/json',
      'Authorization': this.authToken
    });
    return this.http.get(this.API_URL+'/users/profile', { headers: headers })
      .pipe(
        map((res => res.json()))
      );
  }


  // Gets user data in json format
  getUserData() {
    this.loadToken();
    const headers = new Headers({
      'Content-Type':  'application/json',
      'Authorization': this.authToken
    });
    return this.http.get(this.API_URL+'/users/profile', { headers: headers })
      .pipe(
        map((res => res.json()))
      );
  }
  
  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }


  getUserList() {
    this.loadToken();
    const headers = new Headers({
      'Content-Type':  'application/json',
      'Authorization': this.authToken
    });
    return this.http.get(this.API_URL+'/users/list', { headers: headers })
      .pipe(
        map((res => res.json()))
      );
  }


  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  loggedIn(){
    const isExpired = !helper.isTokenExpired(localStorage.getItem('id_token'));
    return isExpired;
  }
}

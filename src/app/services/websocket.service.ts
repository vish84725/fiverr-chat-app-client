import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import * as Rx from 'rxjs';
import { Http, Headers,  } from '@angular/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket;
  user: any;
  private onlineUsersSource = new Rx.BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  API_URL = environment.api_url;

  constructor(
    private authservice: AuthService,
    private http: Http
  ) {
    this.authservice.getUserData().subscribe(data => {
      this.user = data.user;
      this.loginUser(this.user);
      console.log(' From inside websocket.service.ts ' + this.socket.id);
      this.socket.emit('userdata', this.user);
    },
      err => {
        console.log(err);
        return false;
      });
   }

  connect(): Rx.Subject<MessageEvent> {

    this.socket = io(this.API_URL);
    this.socket.on('connect', () => {
      console.log('from websocket.service.ts ' + this.socket.id); // true
    });

    this.socket.on('UserIsOnline', users => {
      console.log('users is online: ', users);
      // this.onlineUsers$.pipe(take(1)).subscribe(usernames => {
        this.onlineUsersSource.next(users);
      // });
    });

    this.socket.on('UserIsOffline', username => {
      console.log('user is offline: ', username);
      this.onlineUsers$.pipe(take(1)).subscribe((usernames)=> {
        this.onlineUsersSource.next([...usernames.filter(x => x !== username)]);
      });
    });

    this.socket.on('GetOnlineUsers', (usernames: string[]) => {
      this.onlineUsersSource.next(usernames);
    });

    
    const observable = new Observable(observer => {
      this.socket.on('new message', (data) => {
        console.log('Received message from websocket Server');
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      }
    });

  const observer = {
      next: (data: Object) => {
        this.socket.emit('message', JSON.stringify(data));
      },
    };

    return Rx.Subject.create(observer, observable);
  }

  joinRoom(data) {
    this.socket.emit('join', data);
  }

  ActivityAgent(data){
    this.socket.emit('activity_agent', data);
  }
  loginUser(user){
    this.socket.emit('login', user);
  }

  logOutUser(userName){
    this.socket.emit('log_out', userName);
  }

  
}

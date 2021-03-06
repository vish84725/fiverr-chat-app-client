import { Injectable, AfterViewChecked, AfterViewInit } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Http, Headers,  } from '@angular/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  messages: Subject<any>;

  API_URL = environment.api_url;

  constructor(
    private wsService: WebsocketService,
    private authservice: AuthService,
    private http: Http
    ) {
    this.messages = <Subject<any>>wsService
    .connect()
    .pipe(
    map((response: any): any => {
      return response;
      })
    );
   }

   sendMsg(msg) {
     this.messages.next(msg);
   }


   // Checks if a chat is already present  
   findRecipient(recipient) {
    const headers = new Headers({
      'Content-Type':  'application/json',
      'Authorization': this.authservice.authToken
    });
    const url = this.API_URL+'/chat/find/' + recipient;
    //console.log(url);
    //console.log(this.authservice.authToken + "   from findRecp()");
    return this.http.get(url , { headers: headers })
      .pipe(
        map((res => res.json()))
      );
  }

  // Creates a new chat,with sender and receiver
  newChat(recipient) {
    const headers = new Headers({
      'Content-Type':  'application/json',
      'Authorization': this.authservice.authToken
    });
    const url = this.API_URL+'/chat/new/' + recipient;
    //console.log(url);
    //console.log(this.authservice.authToken);
    return this.http.get(url , { headers: headers })
      .pipe(
        map((res => res.json()))
      );
  }


  sendReply(message) {
    const headers = new Headers({
      'Content-Type':  'application/json',
      'Authorization': this.authservice.authToken
    });
    const url = this.API_URL+'/chat/' + message.conversation_id;
    return this.http.post(url, message , { headers: headers })
      .pipe(
        map((res => res.json()))
      );
  }

  getMessages(conversationId) {
    const headers = new Headers({
      'Content-Type':  'application/json',
      'Authorization': this.authservice.authToken
    });
    const url = this.API_URL+'/chat/' + conversationId;
    return this.http.get(url, { headers: headers })
      .pipe(
        map((res => res.json()))
      );
  }



}


import { Injectable } from '@angular/core';
import { Observable, fromEvent, BehaviorSubject, Subject } from 'rxjs';
import * as io from 'socket.io-client';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private baseUrl = environment.serverUrl;
  private socket: SocketIOClient.Socket;

  // Not all socket connections connecting the the API might be browsers
  browserNamespaceUrl = '/company-client';
  socketUrl = `${this.baseUrl}${this.browserNamespaceUrl}`;

  private connectedSubject = new BehaviorSubject<boolean>(false);
  public connected$ = this.connectedSubject.asObservable();

  private messageSubject = new Subject<any>();
  public socketMessage$ = this.messageSubject.asObservable();

  constructor() {
    const socketOptions: SocketIOClient.ConnectOpts = {
      autoConnect: false,
      transports: ['websocket'],
      query: {
        // Add custom query here
      }
    };

    this.socket = io(`${this.socketUrl}y`, socketOptions);

    this.socket.on('connect', () => {
      this.connectedSubject.next(true);
    });

    this.socket.on('disconnect', () => {
      this.connectedSubject.next(false);
    });

    this.socket.on('message', (message: any) => {
      this.messageSubject.next(message);
    });
  }

  // Check if the socket it already connected or not
  openSocket(accessToken: string): void {
    if (this.socket.disconnected) {
      // Reset the access token to handle stale tokens
      this.socket.io.opts.query = {
        accessToken
      };

      this.socket.connect();
    } else {
      this.connectedSubject.next(true);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
    }
  }

  emitMessage(message: any): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('message', message);
    }
  }

  // Returns an observable from the namespaced message
  onMessage(): Observable<any> {
    // Return a new observable that namespaces the message
    return fromEvent<any>(this.socket, 'message');
  }
}

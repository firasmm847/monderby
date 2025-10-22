import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { Message } from './model/message';
import { Event } from './model/event';
import socketIo from 'socket.io-client';
//import * as socketIo from 'socket.io-client';
import { environment } from 'src/environments/environment';
//import { MessageService } from '../message/message.service';


const SERVER_URL = environment.SERVER_URL;

@Injectable({
  providedIn: 'root',
})
export class SocketService {
    private socket: any;
    private wakeLock: any;

    private reconnectSocket() {
    try {
      if (this.socket && this.socket.connected) {
        return; // Déjà connecté, rien à faire
      }

      // Réinitialise ou reconnecte
      this.initSocket();
      console.log('Socket reconnected');
    } catch (error) {
      console.error('Erreur lors de la reconnexion WebSocket:', error);
    }
  }

    constructor(/*private messageService: MessageService*/){
      this.initSocket();
      this.requestWakeLock();
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          //console.log('Socket visibilitychange');
          this.requestWakeLock();
          this.reconnectSocket();
        }
      });
      //this.startConnectionCheck(); 
      this.socket.on('disconnect', () => {
        //console.log('Déconnexion détectée. Tentative de reconnexion...');
        console.warn('Socket déconnectée');
        //this.reconnect();
      });
      this.socket.on('reconnect_attempt', () => {
        //console.log('Tentative de reconnexion...');
      });

      this.socket.on('connect_error', (error: any) => {
        console.error('Erreur de connexion socket :', error);
      });
    
      this.socket.on('reconnect', (attemptNumber: number) => {
        //console.log(`Reconnecté après ${attemptNumber} tentatives.`);
        //this.reSubscribeToProjects();
      });
    
      this.socket.on('reconnect_failed', () => {
        //console.log('Toutes les tentatives de reconnexion ont échoué.');
      });
    }

    private async requestWakeLock() {
      try {
        if ('wakeLock' in navigator) {
          this.wakeLock = await (navigator as any).wakeLock.request('screen');
          //console.log('Wake lock activé');

          // Si le wake lock est relâché (ex: passage en veille), on le redemande
          this.wakeLock.addEventListener('release', () => {
            //console.log('Wake lock relâché');
          });
        } else {
          //console.warn('Wake Lock non supporté sur ce navigateur');
        }
      } catch (err) {
        console.error('Erreur lors de l\'activation du wake lock :', err);
      }
    }

    /*reSubscribeToProjects(): void {
      this.subscribeToRoom("0");
      const storedProjects = this.messageService.getListProject();
      if (storedProjects) {
        storedProjects.forEach(value => {
          // Réabonner l'utilisateur à chaque projet après la reconnexion
          this.subscribeToRoom(value.id);
        });
      }
    }*/

    private startConnectionCheck() {
      setInterval(() => {
        if (!this.socket.connected) {
          //console.log('Socket déconnectée, tentative de reconnexion...');
          this.reconnect();
        }
      }, 10000);  // Vérifie toutes les 10 secondes si la socket est toujours connectée
    }

    private reconnect(): void {
      // Implémentez votre logique de réconnexion ici
      // Par exemple, vous pouvez essayer de vous reconnecter après un certain délai
      if (!this.socket.connected) {
        //console.log('socket nest pas connecté...');
        setTimeout(() => {
          this.socket.connect();  // Reconnexion à la socket
        }, 5000);  // Attendre 5 secondes avant de tenter la reconnexion
      }
    }

    public initSocket(): void {
        //this.socket = socketIo(SERVER_URL);
        this.socket = socketIo(SERVER_URL, {
          transports: ['websocket', 'polling'],  // Utilise WebSocket en priorité, puis long polling si nécessaire
          reconnection: true,                    // Activer la reconnexion automatique
          reconnectionAttempts: Infinity,        // Tentatives infinies de reconnexion
          reconnectionDelay: 1000,               // Délai entre chaque tentative de reconnexion
          reconnectionDelayMax: 5000,            // Délai maximal entre chaque tentative
          autoConnect: true
        });
    }

    public send(message: Message): void {
        this.socket.emit('message', message);
    }

    public sendInstant(message: Message): void {
      //console.log("socket envoyé");
      this.socket.emit('message', message, message.action);
    }

    // Écouter quand un utilisateur est en train de taper
    onUserTyping(): Observable<any> {
      return new Observable<any>((observer) => {
        this.socket.on('userTyping', (data: any) => {
          observer.next(data);
        });
      });
    }

    // Écouter quand un utilisateur a arrêté de taper
    onUserStopTyping(): Observable<any> {
      return new Observable<any>((observer) => {
        this.socket.on('userStopTyping', (data: any) => {
          observer.next(data);
        });
      });
    }

    // Envoyer l'indication que l'utilisateur tape
    typing(room: string, userId: string, username: string, imageUrl: string) {
      //console.log("socket typing sent dans "+room+" pour le user "+userId)
      this.socket.emit('typing', room, userId, username, imageUrl);
    }

    // Envoyer l'indication que l'utilisateur a arrêté de taper
    stopTyping(room: string, userId: string, username: string, imageUrl: string) {
      //console.log("socket stop typing sent")
      this.socket.emit('stopTyping', room, userId, username, imageUrl);
    }

    public onMessage(): Observable<Message> {
        return new Observable<Message>(observer => {
            this.socket.on('message', (data: Message) => observer.next(data));
        });
    }

    public onEvent(event: Event): Observable<Event> {
        return new Observable<Event>(observer => {
            this.socket.on(event, (data: Event) => observer.next(data));
        });
    }

    public joinRoom(matchId: any) {
        try {
          //this.socket = io.connect('http://localhost:3000');
          this.socket.emit('join room', matchId.toString());
        } catch (e) {
         //console.log('Could not connect socket.io');
        }
    }

    //------------------------
      subscribeToRoom(roomName: string) {
        console.log("subscribed to room 0");
        this.socket.emit('subscribe', roomName);
      }
    
      unsubscribeFromRoom(roomName: string) {
        this.socket.emit('unsubscribe', roomName);
      }
    
      sendMessage(message: string, roomName: string) {
        this.socket.emit('message', message, roomName);
      }
    
      //onMessage()
      onMessageInstant() {
        return this.socket.fromEvent('message');
      }

      connect() {
        console.log("socket connected");
        this.socket.connect();
      }


}


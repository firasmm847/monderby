import { Component, OnInit, signal } from '@angular/core';
import { Note } from './note';
import { NoteService } from 'src/app/services/apps/notes/note.service';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TablerIconsModule } from 'angular-tabler-icons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Notification {
  id: number;
  type: 'friend_request' | 'challenge' | 'result' | 'reaction';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  avatar?: string;
  actions?: {
    accept?: string;
    decline?: string;
  };
  icon?: string;
}

@Component({
    selector: 'app-notes',
    templateUrl: './notes.component.html',
    styleUrls: ['./notes.component.scss'],
    imports: [
        CommonModule,
        NgScrollbarModule,
        TablerIconsModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
    ]
})
export class AppNotesComponent implements OnInit {

  activeTab: 'all' | 'unread' = 'all';
  
  notifications: Notification[] = [
    {
      id: 1,
      type: 'friend_request',
      title: 'Nouvelle demande d\'ami',
      message: 'Sophie Moreau souhaite vous ajouter comme ami',
      time: 'il y a 37m',
      isRead: false,
      avatar: '/assets/images/profile/user-2.jpg',
      actions: {
        accept: 'Accepter',
        decline: 'Refuser'
      },
      icon: '👥'
    },
    {
      id: 2,
      type: 'challenge',
      title: 'Nouveau défi !',
      message: 'Marie vous défie : "Faire 50 pompes d\'affilée" (30 tokens)',
      time: 'il y a 37m',
      isRead: false,
      actions: {
        accept: 'Accepter',
        decline: 'Décliner'
      },
      icon: '🎯'
    },
    {
      id: 3,
      type: 'result',
      title: 'Résultat de pari 🎉',
      message: 'Vous avez gagné votre pari sur PSG vs Marseille ! +50 tokens',
      time: 'il y a 37m',
      isRead: false,
      icon: '🏆'
    },
    {
      id: 4,
      type: 'reaction',
      title: 'Nouvelle réaction',
      message: 'Alex a aimé ❤️ votre défi "Marquer 3 buts en 5\'!"',
      time: 'il y a 37m',
      isRead: true,
      icon: '❤️'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  get allNotifications(): Notification[] {
    return this.notifications;
  }

  get unreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.isRead);
  }

  get currentNotifications(): Notification[] {
    return this.activeTab === 'all' ? this.allNotifications : this.unreadNotifications;
  }

  get unreadCount(): number {
    return this.unreadNotifications.length;
  }

  setActiveTab(tab: 'all' | 'unread'): void {
    this.activeTab = tab;
  }

  acceptAction(notificationId: number): void {
    console.log('Accept notification:', notificationId);
    // Logique d'acceptation
    this.markAsRead(notificationId);
  }

  declineAction(notificationId: number): void {
    console.log('Decline notification:', notificationId);
    // Logique de refus
    this.markAsRead(notificationId);
  }

  markAsRead(notificationId: number): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(n => n.isRead = true);
    console.log('Toutes les notifications marquées comme lues');
  }

  getNotificationIcon(notification: Notification): string {
    return notification.icon || '🔔';
  }
}
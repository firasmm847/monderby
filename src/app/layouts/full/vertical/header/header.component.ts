import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  OnInit,
  HostListener,
} from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { MatDialog } from '@angular/material/dialog';
import { navItems } from '../sidebar/sidebar-data';
import { TranslateService } from '@ngx-translate/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AppSettings } from 'src/app/config';
import { User } from 'src/app/models';
import { environment } from 'src/environments/environment';
import { SocketService } from 'src/app/services/apps/socket/socket.service';
import { BetService } from 'src/app/services/apps/bet/bet.service';

interface messages {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  badge: string;
}

interface notifications {
  id: number;
  img: string;
  title: string;
  subtitle: string;
}

interface profiledd {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  link: string;
}

interface apps {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  link: string;
}

interface quicklinks {
  id: number;
  title: string;
  link: string;
}

@Component({
    selector: 'app-header',
    imports: [
        RouterModule,
        CommonModule,
        NgScrollbarModule,
        TablerIconsModule,
        MaterialModule,
    ],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit{
  @Input() showToggle = false;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();
  currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  showFiller = false;
  userData: User | null = null;
  img: any;

  isMobile = false;
  activeTab = 'matchs';
  notificationCount = 3;
  showMobileMenu = false;


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    console.log("tab :: "+this.activeTab)
    // Navigation selon l'onglet
    switch(tab) {
      case 'myderby':
        this.router.navigate(['/apps/bets']);
        break;
      case 'matchs':
        this.router.navigate(['/apps/matchs']);
        break;
      case 'amis':
        this.router.navigate(['/amis']);
        break;
      case 'classement':
        this.router.navigate(['/apps/player']);
        break;
      case 'notifications':
        this.router.navigate(['/apps/notes']);
        break;
      case 'profil':
        this.router.navigate(['/apps/profile-details/profile']);
        break;
    }
  }

  onCreateClick() {
    // Action pour créer un nouveau pari
    this.router.navigate(['/create-bet']);
  }

  toggleMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  // Méthode pour détecter la route active automatiquement
  updateActiveTabFromRoute() {
    const currentUrl = this.router.url;
    if (currentUrl.includes('/matchs')) {
      this.activeTab = 'matchs';
    } else if (currentUrl.includes('/amis')) {
      this.activeTab = 'amis';
    } else if (currentUrl.includes('/player')) {
      this.activeTab = 'classement';
    } else if (currentUrl.includes('/notes')) {
      this.activeTab = 'notifications';
    } else if (currentUrl.includes('/profile')) {
      this.activeTab = 'profil';
    } else if (currentUrl.includes('/bets')) {
      this.activeTab = 'myderby';
    }
  }

  ngOnInit(): void {
    this.updateActiveTabFromRoute();
    
    // Écouter les changements de route
    this.router.events.subscribe(() => {
      this.updateActiveTabFromRoute();
    });
    const currentUserString = JSON.parse(localStorage.getItem('currentUser') || 'null');
    this.userData = currentUserString;
    console.log("fullName : "+localStorage.getItem('fullName'));
    this.img = this.userData?.imageUrl ? this.getAvatarlUrl(this.userData.imageUrl) : 'assets/images/profile/user-1.jpg';
    this.socketService.connect();
    this.socketService.subscribeToRoom("0"); 
    this.getPendingNotifications();
    this.socketService.onMessage().subscribe((message: any) => {
        console.log('📩 Nouvelle invitation de pari reçue !', message);
        console.log('current id !', this.currentUser.id);
        if ((message.type === 'BETINVITATION' || message.type === 'BETRESPONSE' || message.type === 'BETRESPONSEUPDATE' || message.type === 'BETUPDATE') && message.recipient === this.currentUser.id) { 
            console.log('socket invitation');
            this.getPendingNotifications();
        } else if(message.type === 'BETRESPONSE' && message.recipient === this.currentUser.id) { 
            console.log('socket response');
            this.getPendingNotifications();
        }
    });
  }

  goPendingBets(){
    this.router.navigate(['/apps/bets']);
  }

  getPendingNotifications() {
    this.betService.getUserBetsPending(this.currentUser.id).subscribe((response) => {
    const notificationList = response['hydra:member'] ?? [];
    this.notifications = notificationList.map((notif: any) => {
    let title = '';
    switch (notif.type) {
      case 'create':
        title = `Invitation de ${notif.user.fullName}`;
        break;
      case 'response':
        title = `Réponse pari de ${notif.user.fullName}`;
        break;
      case 'update':
        title = `${notif.user.fullName} a modifié son choix`;
        break;
      case 'responseupd':
        title = `${notif.user.fullName} a modifié sa réponse`;
        break;
      default:
        title = `Notification de ${notif.user.fullName}`;
    }

    return {
      id: notif.bet.id,
      type: notif.type.toUpperCase(), // ou garde 'RESPONSE', 'INVITATION' si tu veux
      img: notif.user.imageUrl ? this.getAvatarlUrl(notif.user.imageUrl) : '/assets/images/profile/user-1.jpg',
      title: title,
      subtitle: `${notif.bet.match.homeTeam.name} vs ${notif.bet.match.awayTeam.name}`,
      date: notif.bet.match.date
    };
  });

    });
  }

  public selectedLanguage: any = {
    language: 'English',
    code: 'en',
    type: 'US',
    icon: '/assets/images/flag/icon-flag-en.svg',
  };

  public languages: any[] = [
    {
      language: 'English',
      code: 'en',
      type: 'US',
      icon: '/assets/images/flag/icon-flag-en.svg',
    },
    {
      language: 'Español',
      code: 'es',
      icon: '/assets/images/flag/icon-flag-es.svg',
    },
    {
      language: 'Français',
      code: 'fr',
      icon: '/assets/images/flag/icon-flag-fr.svg',
    },
    {
      language: 'German',
      code: 'de',
      icon: '/assets/images/flag/icon-flag-de.svg',
    },
  ];

  @Output() optionsChange = new EventEmitter<AppSettings>();

  constructor(
    private settings: CoreService,
    private vsidenav: CoreService,
    public dialog: MatDialog,
    private router: Router,
    private translate: TranslateService, 
    private socketService: SocketService,
    private betService: BetService
  ) {
    translate.setDefaultLang('en');
    this.checkScreenSize();
  }
  
  getAvatarlUrl(avatarLink: string): string {
    return environment.API_BASE_URL + avatarLink;
  }

  goToPacks(){
    this.router.navigate(['/theme-pages/pricing']);
  }

  options = this.settings.getOptions();

  openDialog() {
    const dialogRef = this.dialog.open(AppSearchDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  private emitOptions() {
    this.optionsChange.emit(this.options);
  }

  setlightDark(theme: string) {
    this.options.theme = theme;
    this.emitOptions();
  }

  changeLanguage(lang: any): void {
    this.translate.use(lang.code);
    this.selectedLanguage = lang;
  }

  messages: messages[] = [
    {
      id: 1,
      img: '/assets/images/profile/user-1.jpg',
      title: 'Roman Joined the Team!',
      subtitle: 'Congratulate him',
      badge: 'bg-primary',
    },
    {
      id: 2,
      img: '/assets/images/profile/user-2.jpg',
      title: 'New message received',
      subtitle: 'Salma sent you new message',
      badge: 'bg-secondary',
    },
    {
      id: 3,
      img: '/assets/images/profile/user-3.jpg',
      title: 'New Payment received',
      subtitle: 'Check your earnings',
      badge: 'bg-error',
    },
    {
      id: 4,
      img: '/assets/images/profile/user-4.jpg',
      title: 'Jolly completed tasks',
      subtitle: 'Assign her new tasks',
      badge: 'bg-success',
    },
    {
      id: 5,
      img: '/assets/images/profile/user-5.jpg',
      title: 'Roman Joined the Team!',
      subtitle: 'Congratulate him',
      badge: 'bg-warning',
    },
  ];

  notifications: notifications[] = [];

  /*notifications: notifications[] = [
    {
      id: 1,
      img: '/assets/images/profile/user-1.jpg',
      title: 'Roman Joined thes Team!',
      subtitle: 'Congratulate him',
    },
    {
      id: 2,
      img: '/assets/images/profile/user-2.jpg',
      title: 'New message received',
      subtitle: 'Salma sent you new message',
    },
    {
      id: 3,
      img: '/assets/images/profile/user-3.jpg',
      title: 'New Payment received',
      subtitle: 'Check your earnings',
    },
    {
      id: 4,
      img: '/assets/images/profile/user-4.jpg',
      title: 'Jolly completed tasks',
      subtitle: 'Assign her new tasks',
    },
    {
      id: 5,
      img: '/assets/images/profile/user-5.jpg',
      title: 'Roman Joined the Team!',
      subtitle: 'Congratulatse him',
    },
  ];*/

  profiledd: profiledd[] = [
    {
      id: 1,
      img: '/assets/images/svgs/icon-account.svg',
      title: 'My Profile',
      subtitle: 'Account Settings',
      link: '/apps/profile-details/profile',
    },
    {
      id: 2,
      img: '/assets/images/svgs/icon-inbox.svg',
      title: 'My Inbox',
      subtitle: 'Messages & Email',
      link: '/apps/email/inbox',
    },
    /*{
      id: 3,
      img: '/assets/images/svgs/icon-tasks.svg',
      title: 'My Tasks',
      subtitle: 'To-do and Daily Tasks',
      link: '/apps/taskboard',
    },*/
  ];

  apps: apps[] = [
    {
      id: 1,
      img: '/assets/images/svgs/icon-dd-chat.svg',
      title: 'Chat Application',
      subtitle: 'Messages & Emails',
      link: '/apps/chat',
    },
    {
      id: 2,
      img: '/assets/images/svgs/icon-dd-cart.svg',
      title: 'Todo App',
      subtitle: 'Completed task',
      link: '/apps/todo',
    },
    {
      id: 3,
      img: '/assets/images/svgs/icon-dd-invoice.svg',
      title: 'Invoice App',
      subtitle: 'Get latest invoice',
      link: '/apps/invoice',
    },
    {
      id: 4,
      img: '/assets/images/svgs/icon-dd-date.svg',
      title: 'Calendar App',
      subtitle: 'Get Dates',
      link: '/apps/calendar',
    },
    {
      id: 5,
      img: '/assets/images/svgs/icon-dd-mobile.svg',
      title: 'Contact Application',
      subtitle: '2 Unsaved Contacts',
      link: '/apps/contacts',
    },
    {
      id: 6,
      img: '/assets/images/svgs/icon-dd-lifebuoy.svg',
      title: 'Tickets App',
      subtitle: 'Create new ticket',
      link: '/apps/tickets',
    },
    {
      id: 7,
      img: '/assets/images/svgs/icon-dd-message-box.svg',
      title: 'Email App',
      subtitle: 'Get new emails',
      link: '/apps/email/inbox',
    },
    {
      id: 8,
      img: '/assets/images/svgs/icon-dd-application.svg',
      title: 'Courses',
      subtitle: 'Create new course',
      link: '/apps/courses',
    },
  ];

  quicklinks: quicklinks[] = [
    {
      id: 1,
      title: 'Pricing Page',
      link: '/theme-pages/pricing',
    },
    {
      id: 2,
      title: 'Authentication Design',
      link: '/authentication/login',
    },
    {
      id: 3,
      title: 'Register Now',
      link: '/authentication/side-register',
    },
    {
      id: 4,
      title: '404 Error Page',
      link: '/authentication/error',
    },
    {
      id: 5,
      title: 'Notes App',
      link: '/apps/notes',
    },
    {
      id: 6,
      title: 'Employee App',
      link: '/apps/employee',
    },
    {
      id: 7,
      title: 'Todo Application',
      link: '/apps/todo',
    },
    {
      id: 8,
      title: 'Treeview',
      link: '/theme-pages/treeview',
    },
  ];
}

@Component({
    selector: 'search-dialog',
    imports: [RouterModule, MaterialModule, TablerIconsModule, FormsModule],
    templateUrl: 'search-dialog.component.html'
})
export class AppSearchDialogComponent {
  searchText: string = '';
  navItems = navItems;

  navItemsData = navItems.filter((navitem) => navitem.displayName);

  // filtered = this.navItemsData.find((obj) => {
  //   return obj.displayName == this.searchinput;
  // });
}

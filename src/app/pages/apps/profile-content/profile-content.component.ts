import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

import { ProfileComponent } from './profile/profile.component';
import { FollowersComponent } from './followers/followers.component';
import { FriendsComponent } from './friends/friends.component';
import { GalleryComponent } from './gallery/gallery.component';
import { MaterialModule } from 'src/app/material.module';
import { IconModule } from 'src/app/icon/icon.module';
import { User } from 'src/app/models';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/services/apps/authentication/authentication.service';


import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { PlayerService } from '../player/player.service';

interface ProfileStats {
  ranking: number;
  rankingLabel: string;
  winRate: number;
  winRateLabel: string;
  tokens: number;
  tokensLabel: string;
  totalBets: number;
  totalBetsLabel: string;
}

interface UserProfile {
  name: string;
  username: string;
  avatar: string;
  tokens: number;
  ranking: number;
  winRate: number;
  isOnline: boolean;
}

@Component({
  selector: 'croppedimagedialog.component',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, ImageCropperComponent],
  templateUrl: 'croppedimagedialog.component.html',
  styleUrls: ['croppedimagedialog.component.scss']
})
export class croppedimagedialog implements OnInit {
  event: ImageCroppedEvent;
  imageChangedEvent: any = '';
  fileToReturn: File | null = null;

  constructor(
    public dialogRef: MatDialogRef<croppedimagedialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.imageChangedEvent = data.event;
  }

  ngOnInit(): void {}

  imageCropped(event: ImageCroppedEvent): void {
  this.event = event;

  const originalEvent = this.imageChangedEvent as InputEvent;
  const inputEl = originalEvent?.target as HTMLInputElement;

  console.log('event :', event);  // vérifie le contenu

  if (inputEl && inputEl.files && inputEl.files.length > 0 && event.blob) {
    const file = inputEl.files[0];
    const filename = file.name;

    // On crée un File à partir du Blob
    this.fileToReturn = new File([event.blob], filename, {
      type: event.blob.type,
    });

    console.log('File ready:', this.fileToReturn);
  } else {
    console.warn('Impossible de récupérer le fichier image');
  }
}


  base64ToFile(data: string, filename: string): File {
    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || '';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  validate(): void {
  if (this.fileToReturn) {
    console.warn('returned');
    this.dialogRef.close({ event: this.event.objectUrl, fileToReturn: this.fileToReturn });
  } else {
    console.warn('Pas de fichier à retourner');
    this.dialogRef.close(null);
  }
}

  /*validate(): void {
    this.dialogRef.close({ event: this.event.base64, fileToReturn: this.fileToReturn });
  }*/

  onNoClick(): void {
    this.dialogRef.close();
  }

  imageLoaded(): void {}
  cropperReady(): void {}
  loadImageFailed(): void {}
}


@Component({
  selector: 'app-profile-content',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    IconModule,
    MatDialogModule,
    ProfileComponent,
    FollowersComponent,
    FriendsComponent,
    GalleryComponent,
    croppedimagedialog
  ],
  templateUrl: './profile-content.component.html',
  styleUrls: ['./profile-content.component.scss']
})
export class ProfileContentComponent implements OnInit {

  activeTab: 'stats' | 'history' | 'settings' = 'stats';
  
  userProfile: UserProfile = {
    name: 'Alex Martin',
    username: '@alexm',
    avatar: '/assets/images/profile/user-2.jpg',
    tokens: 1250,
    ranking: 1,
    winRate: 78,
    isOnline: true
  };

  profileStats: ProfileStats = {
    ranking: 1,
    rankingLabel: 'Classement',
    winRate: 78,
    winRateLabel: 'Taux de victoire',
    tokens: 1250,
    tokensLabel: 'Tokens',
    totalBets: 45,
    totalBetsLabel: 'Paris totaux'
  };
  userData: any | null = null;
  img: any;
  imageFil: File | null = null;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  player : any = null;
  ranking = 0;

  constructor(public dialog: MatDialog,
    private _authenticationService: AuthenticationService,
    private playerService: PlayerService,
    private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) {
      this.userData = JSON.parse(currentUserString);
      this.img = this.userData?.imageUrl
        ? this.getAvatarlUrl(this.userData.imageUrl)
        : 'assets/images/profile/user-1.jpg';
    }
    this.loadPlayers();
  }

  loadPlayers(): void {
    this.playerService.getPlayersRanking().subscribe(players => {
      console.log('players '+JSON.stringify(players) )
      for(let i = 0; i < players.length; i++){
        if(players[i].id = this.userData.id){
          this.player = players[i];
          this.ranking = i+1;
        }
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Affichage d’un aperçu
      const reader = new FileReader();
      reader.onload = () => {
        this.img = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
      this.uploadProfileImage();
    }
  }

  uploadProfileImage(): void {
    if (!this.selectedFile) return;

    this._authenticationService.udapteUserImage(this.selectedFile).subscribe({
            next: data => {
              console.log('Image updated');
              this.getMyInfo();
            },
            error: () => {
              alert('Une erreur est survenue');
            }
          });
  }

  getAvatarlUrl(avatarLink: string): string {
    return environment.API_BASE_URL + avatarLink;
  }

  fileChangeEvent(event: Event): void {
    const userId = this.userData?.id;

    const dialogRef = this.dialog.open(croppedimagedialog, {
      width: '700px',
      data: { event }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== null) {
        this.imageFil = null;
        console.log('Image changed', result);
        this.img = result.event;
        this.imageFil = result.fileToReturn;

        if (this.imageFil) {
          console.log('imageFil checked');
          this._authenticationService.udapteUserImage(this.imageFil).subscribe({
            next: data => {
              console.log('Image updated');
              this.getMyInfo();
            },
            error: () => {
              alert('Une erreur est survenue');
            }
          });
        } else {
          console.log('imageFil not checked');
        }
      } else {
        console.log('Image not changed');
      }
    });
  }

  getMyInfo(): void {
    const user = localStorage.getItem('currentUser');
    const userData = user ? JSON.parse(user) : null;
    this.img = userData?.imageUrl
      ? this.getAvatarlUrl(userData.imageUrl)
      : 'assets/images/profile/user-1.jpg';
  }

  setActiveTab(tab: 'stats' | 'history' | 'settings'): void {
    this.activeTab = tab;
    console.log('Tab changed to:', tab);
  }

  getTabIcon(tab: string): string {
    switch(tab) {
      case 'stats':
        return '📊';
      case 'history':
        return '📋';
      case 'settings':
        return '⚙️';
      default:
        return '';
    }
  }

  getStatIcon(statType: string): string {
    switch(statType) {
      case 'ranking':
        return '🏆';
      case 'winRate':
        return '🎯';
      case 'tokens':
        return '📈';
      case 'totalBets':
        return '📅';
      default:
        return '';
    }
  }

  formatNumber(num: number): string {
    return num.toLocaleString();
  }
}
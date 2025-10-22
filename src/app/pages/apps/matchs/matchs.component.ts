import { Component, Inject, OnInit, signal } from '@angular/core';
import { Match } from './match';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TablerIconsModule } from 'angular-tabler-icons';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatchService } from 'src/app/services/apps/matchs/match.service';
import { Contact } from '../contact/contact';
import { ContactService } from 'src/app/services/apps/contact/contact.service';
import { League } from './league';
import { Matchoff } from './matchoff';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { BetService, CreateBetRequest } from 'src/app/services/apps/bet/bet.service';
import { SocketService } from 'src/app/services/apps/socket/socket.service';
@Component({
    selector: 'app-matchs',
    templateUrl: './matchs.component.html',
    styleUrls: ['./matchs.component.scss'],
    imports: [
        CommonModule,
        NgScrollbarModule,
        TablerIconsModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
    ]
})
export class AppMatchsComponent implements OnInit {
  sidePanelOpened = signal(true);

  matchs = signal<Match[]>([]);
  //leagues = signal<League[]>([]);
  leagues: League[] = [];

  selectedMatch = signal<Match | null>(null);
  selectedLeague = signal<League | null>(null);

  active = signal<boolean>(false);

  searchText = signal<any>('');

  clrName = signal<string>('warning');

  colors = [
    { colorName: 'primary' },
    { colorName: 'warning' },
    { colorName: 'secondary' },
    { colorName: 'error' },
    { colorName: 'success' },
  ];

  currentMatchTitle = signal<string>('');
  currentLeagueTitle = signal<string>('');
  selectedColor = signal<string | null>(null);
  
  
  contacts = signal<Contact[]>([]);
  matchsoff = signal<Matchoff[]>([]);
  selectedLeagueMatchs = signal<Matchoff[]>([]);
  currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  constructor(public matchService: MatchService,public socketService: SocketService, public betService : BetService, public dialog: MatDialog, private snackBar: MatSnackBar, private contactService: ContactService) {}

  ngOnInit(): void {
    this.contacts.set(this.contactService.getContacts());
    this.matchs.set(this.matchService.getMatchs());
    this.matchsoff.set(this.matchService.getMatchsoff());
    this.selectedLeague.set(null);
    this.matchService.getAllMatchs().subscribe(matches => {
        this.selectedLeagueMatchs.set(matches);
        this.selectedLeague.set(null);
        this.currentLeagueTitle.set('All');
    });
    this.matchService.getLeagues().subscribe(leagues => {
      this.leagues = leagues;
      //this.leaguesDisplay = leagues.map(mapToLeagueDisplay);
    });
    this.selectedMatch.set(this.matchs()[0]);
    const firstLeague = this.leagues[0];
    if (firstLeague && firstLeague.id) {
        this.matchService.getMatchsByLeagueId(firstLeague.id).subscribe(matches => {
        this.selectedLeagueMatchs.set(matches);
    });
    }
    const currentMatch = this.selectedMatch();
    if (currentMatch) {
      this.selectedColor.set(currentMatch.color);
      this.clrName.set(currentMatch.color);
      this.currentMatchTitle.set(currentMatch.title);
    }
  }

  get currentMatch(): Match | null {
    return this.selectedMatch();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.matchs.set(this.filter(filterValue));
  }

  filter(v: string): Match[] {
    return this.matchService
      .getMatchs()
      .filter((x) => x.title.toLowerCase().includes(v.toLowerCase()));
  }

  isOver(): boolean {
    return window.matchMedia(`(max-width: 960px)`).matches;
  }

  onSelect(match: Match): void {
    this.selectedMatch.set(match);
    this.clrName.set(match.color);
    this.currentMatchTitle.set(match.title);
    this.selectedColor.set(match.color);
  }

  onSelectLeague(league: League | null): void {
    if (!league) {
    this.selectedLeague.set(null);
      this.matchService.getAllMatchs().subscribe(matches => {
          this.selectedLeagueMatchs.set(matches);
          this.selectedLeague.set(null);
          this.currentLeagueTitle.set('All');
      });
      return;
    };
    this.selectedLeague.set(league);
    this.currentLeagueTitle.set(league.name);

    if (league && league.id) {
        this.matchService.getMatchsByLeagueId(league.id).subscribe(matches => {
          this.selectedLeagueMatchs.set(matches);
      });
    }
  }

  /*
  onSelectColor(colorName: string): void {
    this.clrName.set(colorName);
    this.selectedColor.set(colorName);
    const currentMatch = this.selectedMatch();
    if (currentMatch) {
      currentMatch.color = this.clrName();
      this.matchService.updateMatch(currentMatch);
    }
    this.active.set(!this.active());
  }*/

    /*
  removematch(match: Match): void {
    this.matchService.removeMatch(match);
    this.matchs.set(this.matchService.getMatchs());

    if (this.selectedMatch() === match) {
      this.selectedMatch.set(null);
      this.currentMatchTitle.set('');
    }
    this.openSnackBar('Match deleted successfully!');
  }*/

  removeLeague(league: League): void {
    /*this.matchService.removeLeague(league);
    this.leagues = this.matchService.getLeagues();

    if (this.selectedLeague() === league) {
      this.selectedLeague.set(null);
      this.currentLeagueTitle.set('');
    }*/
    this.openSnackBar('League deleted successfully!');
  }

  addMatchClick(): void {
    const newMatch: Match = {
      color: this.clrName(),
      title: 'This is a new match',
      datef: new Date(),
    };
    this.matchService.addMatch(newMatch);
    this.matchs.set(this.matchService.getMatchs());

    this.openSnackBar('Match added successfully!');
  }

  updateMatchTitle(newTitle: string): void {
    const currentMatch = this.selectedMatch();
    if (currentMatch) {
      currentMatch.title = newTitle;
      this.matchService.updateMatch(currentMatch);
      this.matchs.set(this.matchService.getMatchs());
    }
  }

  openSnackBar(
    message: string,
    action: string = 'Close',
    type: 'create' | 'delete' = 'create'
  ): void {
    this.snackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  openDialog(action: string, data: any): void {
    const dialogRef = this.dialog.open(ParisDialogComponent, {
      data: { action, ...data },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && action === 'Bet') {
        console.log('Création du pari:', result);
        this.createBet(result);
      }
    });
  }
  
  getLeaguelUrl(avatar: any){
    return avatar ? environment.API_BASE_URL+avatar : 'https://crests.football-data.org/65.svg';
  }

  getShortTeamName(teamName: string): string {
    if (teamName.length <= 10) {
      return teamName;
    }
    
    const words = teamName.split(' ');
    
    if (words.length >= 2) {
      // Premier mot + première lettre du deuxième mot
      return words[0] + ' ' + words[1].charAt(0);
    }
    
    // Si un seul mot très long, on tronque à 10 caractères
    return teamName.substring(0, 10);
  }

  // Dans ton composant de matchs
createBet(betData: any) {
  const request: CreateBetRequest = {
    type: 'match',
    matchId: betData.matchId,
    deadline: betData.deadline,
    tokenAmount: betData.tokenAmount || 0,
    invitedUsers: betData.invitedUsers
  };

  this.betService.createBet(request).subscribe({
    next: (response) => {
      console.log('Pari créé:', response);
      
      this.snackBar.open(
        `Pari créé ! ${response.data.participantsCount} ami(s) invité(s). 10 jetons débités.`,
        'OK',
        { duration: 4000 }
      );
    },
    error: (error) => {
      console.error('Erreur création pari:', error);
      
      const errorMessage = error.error?.message || 'Erreur lors de la création du pari';
      this.snackBar.open(errorMessage, 'OK', {
        duration: 4000
      });
    }
  });
}
  
  
  /*createBet(betData: any) {
    const request: CreateBetRequest = {
      type: 'match',
      matchId: betData.matchId,
      deadline: betData.deadline,
      tokenAmount: betData.tokenAmount || 0,
      invitedUsers: betData.invitedUsers
    };

    this.betService.createBet(request).subscribe({
      next: (response) => {
        console.log('Pari créé:', response);
        
        this.snackBar.open(
          `Pari créé ! ${response.data.participantsCount} ami(s) invité(s). 10 jetons débités.`,
          'OK',
          { duration: 4000 }
        );

        // Rafraîchir les données ou rediriger
        // this.loadMatches(); // ou autre action
      },
      error: (error) => {
        console.error('Erreur création pari:', error);
        
        const errorMessage = error.error?.message || 'Erreur lors de la création du pari';
        this.snackBar.open(errorMessage, 'OK', {
          duration: 4000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }*/

  // Dans un composant où le créateur peut valider
  selectWinner(bet: any, winnerId: string) {
    if (!this.betService.canValidateWinner(bet)) {
      this.snackBar.open('Vous ne pouvez pas encore valider le gagnant', 'OK');
      return;
    }

    this.betService.validateWinner(bet.id, winnerId).subscribe({
      next: (response) => {
        this.snackBar.open(
          `${response.data.winnerName} remporte ${response.data.totalPot} jetons !`,
          'OK',
          { duration: 4000 }
        );
        //this.loadMyBets();
      },
      error: (error) => {
        this.snackBar.open(
          error.error?.message || 'Erreur lors de la validation',
          'OK',
          { duration: 3000 }
        );
      }
    });
  }

  // Composant pour afficher les invitations reçues
  acceptBetInvitation(bet: any, choice: string) {
    this.betService.acceptBet(bet.id, choice).subscribe({
      next: (response) => {
        this.snackBar.open(
          `Pari accepté ! ${response.data.remainingTokens} jetons restants.`,
          'OK',
          { duration: 3000 }
        );
        // Rafraîchir la liste
        //this.loadMyBets();
      },
      error: (error) => {
        this.snackBar.open(
          error.error?.message || 'Erreur lors de l\'acceptation',
          'OK',
          { duration: 3000 }
        );
      }
    });
  }

  refuseBetInvitation(bet: any) {
    this.betService.refuseBet(bet.id).subscribe({
      next: (response) => {
        this.snackBar.open('Pari refusé', 'OK', { duration: 2000 });
        //this.loadMyBets();
      },
      error: (error) => {
        this.snackBar.open('Erreur lors du refus', 'OK', { duration: 3000 });
      }
    });
  }

  //ancien create bet method
  /*createBet(betData: any) {
    
    const createBetRequest: CreateBetRequest = {
      user: `/api/users/${this.currentUser.id}`,           // IRI format
      invitedUser: `/api/users/${betData.friendId}`,  // IRI format
      match: `/api/matches/${betData.matchId}`,       // IRI format
      choice: betData.selectedBet,
      tokenAmount: betData.tokens
    };

    this.betService.createBet(createBetRequest).subscribe({
      next: (response) => {
        console.log('Pari créé avec succès:', response);
        this.snackBar.open(
          `Pari créé ! Invitation envoyée à ${betData.friendUsername}`, 
          'OK', 
          { duration: 4000, panelClass: ['success-snackbar'] }
        );
        this.socketService.sendInstant({
          id: "0",
          action: "0",
          type: "BETINVITATION",
          author: this.currentUser.id,
          author_name: "",
          recipient: response.invitedUser.id,
          text: "",
          copy: "",
          private: false,
          res: response,
          project_lib: "",
          date: ""
        });
      },
      error: (error) => {
        console.error('Erreur lors de la création du pari:', error);
        let errorMessage = 'Erreur lors de la création du pari';
        
        // Gérer les erreurs ApiPlatform
        if (error.error && error.error['hydra:description']) {
          errorMessage = error.error['hydra:description'];
        }
        
        this.snackBar.open(errorMessage, 'OK', { 
          duration: 4000, 
          panelClass: ['error-snackbar'] 
        });
      }
    });
  }*/
}

// paris-dialog.component.ts
@Component({
  selector: 'app-paris',
  templateUrl: 'paris-dialog.html',
  styleUrls: ['./paris-dialog.component.scss'],
  imports: [
    MaterialModule,
    CommonModule,
    TablerIconsModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
  ],
})
export class ParisDialogComponent {
  action: string;
  users: any[] = [];
  dateControl = new FormControl();
  selectedFriends: any[] = []; // Changé pour multi-sélection
  selectedTokens: number = 10; // Changé à 10 (frais d'entrée fixe)
  tokenOptions = [10]; // Uniquement 10 tokens maintenant
  friends: any[] = [];
  currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  objectif: string = '';
  showObjective = false;
  step = 1;

  constructor(
    public dialogRef: MatDialogRef<ParisDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private contactService: ContactService,
    private snackBar: MatSnackBar
  ) {
    this.action = data.action;
    this.data = data;
    
    if (this.action === 'Bet') {
      this.loadFriends();
    }
  }

  
  nextStep() { this.step++; }
  previousStep() { 
    if(this.step === 1){
      this.closeDialog();
    }
    this.step--; 
  }

  loadFriends() {
    this.contactService.getContactsoff().subscribe(res => {
      res = res as any;
      this.friends = (res as any)['hydra:member'];
      this.friends = this.friends.sort(function (a, b) {
        if (a.fullName.toLowerCase() < b.fullName.toLowerCase()) { return -1; }
        if (a.fullName.toLowerCase() > b.fullName.toLowerCase()) { return 1; }
        return 0;
      })
    })
  }

  getPredictionText(bet: string): string {
    switch(bet) {
      case '1': return 'Victoire domicile';
      case 'X': return 'Match nul';
      case '2': return 'Victoire extérieur';
      default: return '';
    }
  }

  getCote(bet: string): number {
    const cotes = {
      '1': 2.1,
      'X': 3.2,
      '2': 2.8
    };
    return cotes[bet as keyof typeof cotes] || 2.0;
  }

  calculateTotalPot(): number {
    // Créateur + participants invités
    return 10 * (1 + this.selectedFriends.length);
  }

  calculatePotentialGain(): number {
    // Le gagnant récupère tout le pot
    return this.calculateTotalPot();
  }

  isSelectable(friend: any): boolean {
    return friend.id !== this.currentUser.id && !this.selectedFriends.find(f => f.id === friend.id);
  }


  confirmBet() {
    if (this.selectedFriends.length === 0) {
      this.snackBar.open('Veuillez sélectionner au moins un ami', 'OK', { duration: 3000 });
      return;
    }

    // Calculer la deadline (par exemple 1 heure avant le match)
    const matchDate = new Date(this.data.match.date);
    matchDate.setHours(matchDate.getHours() - 1);

    const betData = {
      type: 'match',
      matchId: this.data.match.id,
      homeTeam: this.data.match.homeTeam.name,
      awayTeam: this.data.match.awayTeam.name,
      selectedBet: this.data.selectedBet,
      predictionText: this.getPredictionText(this.data.selectedBet),
      invitedUsers: this.selectedFriends.map(f => f.id),
      invitedFriends: this.selectedFriends.map(f => ({
        id: f.id,
        name: f.fullName,
        avatar: f.imageUrl
      })),
      deadline: matchDate.toISOString(),
      tokenAmount: 0, // Pas utilisé pour l'instant
      objectif: this.objectif || '',
      entryFee: 10,
      totalPot: this.calculateTotalPot(),
      potentialGain: this.calculatePotentialGain()
    };
    
    this.dialogRef.close(betData);
  }

  getAvatarlUrl(avatar: any){
    return avatar ? environment.API_BASE_URL+avatar : '/assets/images/profile/user-2.jpg';
  }

  removeFriend(friend: any) {
    const index = this.selectedFriends.findIndex(f => f.id === friend.id);
    if (index > -1) {
      this.selectedFriends.splice(index, 1);
    }
  }

  addFriend(friend: any) {
    if (!this.selectedFriends.find(f => f.id === friend.id)) {
      this.selectedFriends.push(friend);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.users = this.contactService.getContacts();
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  trackByUser(user: any): any {
    return user.id; 
  }

  doAction() {
    // Ton code existant
  }
}
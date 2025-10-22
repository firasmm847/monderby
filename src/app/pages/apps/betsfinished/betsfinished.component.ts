import { Component, computed, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TablerIconsModule } from 'angular-tabler-icons';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatchService } from 'src/app/services/apps/matchs/match.service';
import { Contact } from '../contact/contact';
import { ContactService } from 'src/app/services/apps/contact/contact.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { BetService, CreateBetRequest } from 'src/app/services/apps/bet/bet.service';
import { ParisDialogComponent } from '../matchs/matchs.component';
import { Match } from '../matchs/match';
import { League } from '../matchs/league';
import { Matchoff } from '../matchs/matchoff';
import { Bet } from '../bets/bet.interface';

@Component({
  selector: 'app-betsfinished',
  templateUrl: './betsfinished.component.html',
  styleUrl: './betsfinished.component.scss',
  imports: [
        CommonModule,
        NgScrollbarModule,
        TablerIconsModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
    ]
})
export class BetsfinishedComponent implements OnInit {
  allBets = signal<Bet[]>([]);
  loading = signal<boolean>(true);
  selectedTab = signal<string>('all'); // 'all', 'created', 'invited'
  currentUser: any;
  weekDates: Date[] = [];
  selectedDate = signal<Date | null>(null); 

  // Computed pour filtrer les paris selon l'onglet
  filteredBets = computed(() => {
    let bets = this.allBets();
    const tab = this.selectedTab();
    const selectedDate = this.selectedDate();
    if (selectedDate) {
      bets = bets.filter(bet => {
        const betDate = new Date(bet.match.date);
        return betDate.toDateString() === selectedDate.toDateString();
      });
    }
    console.log("taaa : "+bets.length)
    switch (tab) {
      case 'won':
        return bets.filter(bet => bet.winner === this.currentUser.id);
      case 'lost':
        return bets.filter(bet => bet.winner !== this.currentUser.id);
      default:
        return bets;
    }
  });

  constructor(
    private betService: BetService,
    private snackBar: MatSnackBar
  ) {
    const userData = localStorage.getItem('currentUser');
    this.currentUser = userData ? JSON.parse(userData) : null;
  }

  ngOnInit() {
    this.generateWeekDates();
    this.loadBets();
  }

  loadBets() {
    this.loading.set(true);
    
    this.betService.getUserBetsFinished().subscribe({
      next: (response) => {
        this.allBets.set(response['hydra:member'] || []);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des paris:', error);
        this.snackBar.open('Erreur lors du chargement des paris', 'OK', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }

  onTabChange(tab: string) {
    this.selectedTab.set(tab);
  }

  getChoiceText(choice: string): string {
    if(!choice) return "";
    const choices: { [key: string]: string } = {
      '1': 'Victoire domicile',
      'X': 'Match nul',
      '2': 'Victoire extérieur'
    };
    return choices[choice] || choice;
  }

  getAvatarlUrl(avatar: any){
    return avatar ? environment.API_BASE_URL+avatar : '/assets/images/profile/user-2.jpg';
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

  getStatusText(status: string): string {
    const statuses: { [key: string]: string } = {
      'notstarted': 'Not started',
      'live': 'En cours',
      'finished': 'Terminé',
      'postponed': 'Reporté',
      'suspended': 'Suspendu'
    };
    return statuses[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'notstarted': 'warn',
      'live': 'primary',
      'finished': 'warn',
      'postponed': 'accent',
      'suspended': 'warn'
    };
    return colors[status] || 'primary';
  }

  isUserCreator(bet: Bet): boolean {
    return bet.user.id == this.currentUser.id;
  }

  canRespond(bet: Bet): boolean {
    return !this.isUserCreator(bet) && bet.status === 'notstarted';
  }

  /*updateBet(bet: any, newChoice: string) {
    bet.editing = false;
    this.betSelected = null;
    bet.choice = newChoice;
    if (this.editingBets.has(bet.id)) {
      this.editingBets.delete(bet.id);
    }
    this.betService.updateBet(bet.id, newChoice).subscribe({
      next: () => console.log("Choix update mis à jour avec succès"),
      error: (err) => console.error("Erreur lors de la mise à jour", err)
    });
  }
  
  updateResponseBet(bet: any, newChoice: string) {
     bet.editing = false;
    this.betSelected = null;
    bet.invitedChoice = newChoice;
    if (this.editingBets.has(bet.id)) {
      this.editingBets.delete(bet.id);
    }
    this.betService.updateResponseBet(bet.id, newChoice).subscribe({
      next: (updatedBet) => {
        this.socketService.sendInstant({
          id: "0",
          action: "0",
          type: "BETRESPONSE",
          author: this.currentUser.id,
          author_name: "",
          recipient: bet.user.id,
          text: "",
          copy: "",
          private: false,
          res: updatedBet,
          project_lib: "",
          date: ""
        });
        this.snackBar.open('Pari accepté !', 'OK', { duration: 3000 });
        this.loadBets(); // Recharger la liste
      },
      error: (error) => {
        console.error('Erreur lors de l\'acceptation du pari:', error);
        this.snackBar.open('Erreur lors de l\'acceptation du pari', 'OK', { duration: 3000 });
      }
    });
  }*/

  rejectBet(bet: Bet) {
    this.betService.rejectBet(bet.id).subscribe({
      next: (updatedBet) => {
        this.snackBar.open('Pari refusé', 'OK', { duration: 3000 });
        this.loadBets();
      },
      error: (error) => {
        console.error('Erreur lors du refus du pari:', error);
        this.snackBar.open('Erreur lors du refus du pari', 'OK', { duration: 3000 });
      }
    });
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

  generateWeekDates() {
    const today = new Date();
    const dates = [];
    
    // Générer 7 jours : aujourd'hui + 6 jours suivants
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    this.weekDates = dates;
  }

  getDayName(date: Date): string {
    return date.toLocaleDateString('fr-FR', { weekday: 'short' });
  }

  getDayNumber(date: Date): string {
    return date.getDate().toString();
  }

  selectDate(date: Date) {
    const currentSelected = this.selectedDate();
    const isSameDate = currentSelected?.toDateString() === date.toDateString();
    this.selectedDate.set(isSameDate ? null : date); // Utiliser .set()
  }

  cancelDate() {
    this.selectedDate.set(null);
  }

  isSelectedDate(date: Date): boolean {
    const selected = this.selectedDate(); // Utiliser () pour récupérer la valeur
    return selected?.toDateString() === date.toDateString();
  }

  getMatchesCount(date: Date): number {
    // Compter les paris pour cette date
    return this.filteredBets().filter(bet => 
      new Date(bet.match.date).toDateString() === date.toDateString()
    ).length;
  }
}

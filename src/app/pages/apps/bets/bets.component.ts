// my-bets.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BetService } from 'src/app/services/apps/bet/bet.service';
import { ChoiceBetDialogComponent } from '../choice-bet-dialog/choice-bet-dialog.component';
import { SelectWinnerDialogComponent } from '../select-winner-dialog/select-winner-dialog.component';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TablerIconsModule } from 'angular-tabler-icons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-bets',
  templateUrl: './bets.component.html',
  styleUrls: ['./bets.component.scss'],
    imports: [
        CommonModule,
        NgScrollbarModule,
        TablerIconsModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
    ]
})
export class AppBetsComponent implements OnInit {
  createdBets: any[] = [];
  participatedBets: any[] = [];
  loading = false;
  currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  constructor(
    private betService: BetService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadMyBets();
  }

  loadMyBets() {
    this.loading = true;
    
    this.betService.getMyBets().subscribe({
      next: (response) => {
        console.log('Mes paris:', response);
        
        if (response.success) {
          this.createdBets = response.data.createdBets || [];
          this.participatedBets = response.data.participatedBets || [];
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur chargement paris:', error);
        this.snackBar.open(
          'Erreur lors du chargement des paris',
          'OK',
          { duration: 3000 }
        );
        this.loading = false;
      }
    });
  }

  getBetStatusLabel(status: string): string {
    const labels: any = {
      'open': 'Ouvert',
      'waiting_validation': 'En attente de validation',
      'finished': 'Terminé',
      'cancelled': 'Annulé',
      'notstarted': 'Pas commencé',
      'live': 'En cours',
      'postponed': 'Reporté',
      'suspended': 'Suspendu'
    };
    return labels[status] || status;
  }

  getBetStatusColor(status: string): string {
    const colors: any = {
      'open': 'primary',
      'waiting_validation': 'accent',
      'finished': 'success',
      'cancelled': 'error',
      'live': 'warn'
    };
    return colors[status] || 'default';
  }

  getParticipationStatusLabel(status: string): string {
    const labels: any = {
      'pending': 'En attente',
      'accepted': 'Accepté',
      'refused': 'Refusé'
    };
    return labels[status] || status;
  }

  canAcceptBet(bet: any): boolean {
    if (!bet.myParticipation) return false;
    return bet.myParticipation.status === 'pending' && 
           bet.status === 'open' && 
           !bet.isExpired;
  }

  canValidateWinner(bet: any): boolean {
    return false;
    return this.betService.canValidateWinner(bet);
  }

  acceptBet(bet: any) {
    if (bet.type === 'match') {
      this.openChoiceDialog(bet);
    } else {
      this.acceptBetWithChoice(bet.id, null);
    }
  }

  openChoiceDialog(bet: any) {
    const dialogRef = this.dialog.open(ChoiceBetDialogComponent, {
      data: { bet },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(choice => {
      if (choice) {
        this.acceptBetWithChoice(bet.id, choice);
      }
    });
  }

  acceptBetWithChoice(betId: string, choice: string | null) {
    this.betService.acceptBet(betId, choice || undefined).subscribe({
      next: (response) => {
        this.snackBar.open(
          `Pari accepté ! ${response.data.remainingTokens} jetons restants`,
          'OK',
          { duration: 3000 }
        );
        this.loadMyBets();
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

  refuseBet(bet: any) {
    this.betService.refuseBet(bet.id).subscribe({
      next: () => {
        this.snackBar.open('Pari refusé', 'OK', { duration: 2000 });
        this.loadMyBets();
      },
      error: (error) => {
        this.snackBar.open('Erreur lors du refus', 'OK', { duration: 3000 });
      }
    });
  }

  validateWinner(bet: any) {
    const dialogRef = this.dialog.open(SelectWinnerDialogComponent, {
      data: { bet },
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(winnerId => {
      if (winnerId) {
        this.betService.validateWinner(bet.id, winnerId).subscribe({
          next: (response) => {
            this.snackBar.open(
              `${response.data.winnerName} remporte ${response.data.totalPot} jetons !`,
              'OK',
              { duration: 4000 }
            );
            this.loadMyBets();
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
    });
  }

  deleteBet(bet: any) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce pari ?')) {
      this.betService.deleteBet(bet.id).subscribe({
        next: () => {
          this.snackBar.open('Pari supprimé', 'OK', { duration: 2000 });
          this.loadMyBets();
        },
        error: (error) => {
          this.snackBar.open('Erreur lors de la suppression', 'OK', { duration: 3000 });
        }
      });
    }
  }

  getAcceptedParticipantsCount(bet: any): number {
    return bet.participants?.filter((p: any) => p.status === 'accepted').length || 0;
  }

  getPendingParticipantsCount(bet: any): number {
    return bet.participants?.filter((p: any) => p.status === 'pending').length || 0;
  }
}
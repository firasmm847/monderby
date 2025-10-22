// select-winner-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-winner-dialog',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule],
  template: `
    <h2 mat-dialog-title>Sélectionner le gagnant</h2>
    
    <mat-dialog-content>
      <div class="bet-info">
        <div *ngIf="data.bet.type === 'match'">
          <h3>{{ data.bet.match.homeTeam }} vs {{ data.bet.match.awayTeam }}</h3>
        </div>
        <div *ngIf="data.bet.type === 'custom'">
          <h3>Pari personnalisé</h3>
          <p class="objective">{{ data.bet.objective }}</p>
        </div>
        
        <p class="pot-info">
          <strong>Cagnotte:</strong> {{ data.bet.totalPot }} jetons
        </p>
      </div>

      <div class="participants-list">
        <h4>Sélectionnez le gagnant:</h4>
        
        <mat-radio-group [(ngModel)]="selectedWinnerId">
          <!-- Créateur -->
          <div class="participant-item">
            <mat-radio-button [value]="data.bet.creator.id">
              <div class="participant-info">
                <img 
                  [src]="getAvatarUrl(data.bet.creator)" 
                  alt="{{ data.bet.creator.name }}"
                  class="avatar">
                <div>
                  <strong>{{ data.bet.creator.name }}</strong>
                  <span class="badge creator-badge">Créateur</span>
                  <div class="choice-info" *ngIf="getCreatorChoice()">
                    Choix: {{ getCreatorChoice() }}
                  </div>
                </div>
              </div>
            </mat-radio-button>
          </div>

          <!-- Participants acceptés -->
          <div 
            *ngFor="let participant of getAcceptedParticipants()" 
            class="participant-item">
            <mat-radio-button [value]="participant.user.id">
              <div class="participant-info">
                <img 
                  [src]="getAvatarUrl(participant.user)" 
                  alt="{{ participant.user.name }}"
                  class="avatar">
                <div>
                  <strong>{{ participant.user.name }}</strong>
                  <div class="choice-info" *ngIf="participant.choice">
                    Choix: {{ participant.choice }}
                  </div>
                </div>
              </div>
            </mat-radio-button>
          </div>
        </mat-radio-group>
      </div>

      <div class="warning-box">
        <mat-icon>warning</mat-icon>
        <span>Cette action est irréversible. Le gagnant recevra immédiatement les {{ data.bet.totalPot }} jetons.</span>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button 
        mat-flat-button 
        color="primary" 
        [disabled]="!selectedWinnerId"
        (click)="confirm()">
        Confirmer le gagnant
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .bet-info {
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .bet-info h3 {
      margin: 0 0 8px 0;
    }

    .objective {
      background: #f5f5f5;
      padding: 12px;
      border-radius: 8px;
      margin: 8px 0;
    }

    .pot-info {
      font-size: 16px;
      color: #4caf50;
      margin: 8px 0 0 0;
    }

    .participants-list h4 {
      margin: 0 0 16px 0;
      font-size: 16px;
    }

    .participant-item {
      margin-bottom: 16px;
      padding: 12px;
      border-radius: 8px;
      transition: background 0.2s;
    }

    .participant-item:hover {
      background: #f5f5f5;
    }

    .participant-info {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-left: 8px;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      margin-left: 8px;
    }

    .creator-badge {
      background: #e3f2fd;
      color: #1976d2;
    }

    .choice-info {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    }

    .warning-box {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #fff3e0;
      padding: 16px;
      border-radius: 8px;
      margin-top: 24px;
    }

    .warning-box mat-icon {
      color: #ff9800;
    }

    .warning-box span {
      font-size: 13px;
      color: #e65100;
    }
  `]
})
export class SelectWinnerDialogComponent {
  selectedWinnerId: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<SelectWinnerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  getAcceptedParticipants() {
    return this.data.bet.participants?.filter((p: any) => p.status === 'accepted') || [];
  }

  getCreatorChoice() {
    const creatorParticipation = this.data.bet.participants?.find(
      (p: any) => p.user.id === this.data.bet.creator.id
    );
    return creatorParticipation?.choice;
  }

  getAvatarUrl(user: any): string {
    return user.imageUrl || user.avatar || '/assets/images/profile/user-2.jpg';
  }

  confirm() {
    this.dialogRef.close(this.selectedWinnerId);
  }
}
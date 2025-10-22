// choice-bet-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-choice-bet-dialog',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  template: `
    <h2 mat-dialog-title>Choisir votre pronostic</h2>
    
    <mat-dialog-content>
      <div class="match-info">
        <h3>{{ data.bet.match.homeTeam }} vs {{ data.bet.match.awayTeam }}</h3>
        <p class="text-muted">{{ data.bet.match.date | date:'dd/MM/yyyy HH:mm' }}</p>
      </div>

      <div class="choices">
        <button 
          mat-flat-button 
          class="choice-btn"
          [class.selected]="selectedChoice === '1'"
          (click)="selectChoice('1')">
          <div class="choice-content">
            <span class="choice-label">1</span>
            <span class="choice-text">Victoire {{ data.bet.match.homeTeam }}</span>
          </div>
        </button>

        <button 
          mat-flat-button 
          class="choice-btn"
          [class.selected]="selectedChoice === 'X'"
          (click)="selectChoice('X')">
          <div class="choice-content">
            <span class="choice-label">X</span>
            <span class="choice-text">Match nul</span>
          </div>
        </button>

        <button 
          mat-flat-button 
          class="choice-btn"
          [class.selected]="selectedChoice === '2'"
          (click)="selectChoice('2')">
          <div class="choice-content">
            <span class="choice-label">2</span>
            <span class="choice-text">Victoire {{ data.bet.match.awayTeam }}</span>
          </div>
        </button>
      </div>

      <div class="info-box">
        <p><strong>Frais d'entrée:</strong> 10 jetons</p>
        <p><strong>Cagnotte totale:</strong> {{ data.bet.totalPot }} jetons</p>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button 
        mat-flat-button 
        color="primary" 
        [disabled]="!selectedChoice"
        (click)="confirm()">
        Confirmer (10 jetons)
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .match-info {
      text-align: center;
      margin-bottom: 24px;
    }

    .match-info h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
    }

    .choices {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 24px;
    }

    .choice-btn {
      width: 100%;
      padding: 16px;
      background: #f5f5f5;
      border: 2px solid transparent;
      transition: all 0.2s;
    }

    .choice-btn:hover {
      background: #e0e0e0;
    }

    .choice-btn.selected {
      background: #e3f2fd;
      border-color: #2196f3;
    }

    .choice-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .choice-label {
      font-size: 24px;
      font-weight: 700;
      min-width: 40px;
    }

    .choice-text {
      font-size: 16px;
      text-align: left;
    }

    .info-box {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
    }

    .info-box p {
      margin: 4px 0;
      font-size: 14px;
    }
  `]
})
export class ChoiceBetDialogComponent {
  selectedChoice: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<ChoiceBetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  selectChoice(choice: string) {
    this.selectedChoice = choice;
  }

  confirm() {
    this.dialogRef.close(this.selectedChoice);
  }
}
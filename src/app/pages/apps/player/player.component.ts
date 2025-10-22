import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { PlayerService } from './player.service';
import { MatTableDataSource } from '@angular/material/table';
import { Player } from './player';

interface User {
  id: number;
  name: string;
  photo: string;
  gamesPlayed: number;
  winRate: number;
  tokens: number;
  position: number;
  badge?: string;
}

interface Tournament {
  id: number;
  name: string;
  league: string;
  startDate: string;
  participants: number;
  isActive: boolean;
}

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    CommonModule,
  ],
})
export class PlayerComponent implements OnInit {

  activeTab: 'week' | 'month' | 'allTime' = 'week';
  
  users: User[] = [
    {
      id: 1,
      name: 'Alex Martin',
      photo: 'assets/images/alex.jpg',
      gamesPlayed: 45,
      winRate: 78,
      tokens: 1250,
      position: 1,
      badge: 'crown'
    },
    {
      id: 2,
      name: 'Marie Dubois',
      photo: 'assets/images/marie.jpg',
      gamesPlayed: 38,
      winRate: 72,
      tokens: 980,
      position: 2,
      badge: 'silver'
    },
    {
      id: 3,
      name: 'Thomas Petit',
      photo: 'assets/images/thomas.jpg',
      gamesPlayed: 42,
      winRate: 69,
      tokens: 856,
      position: 3,
      badge: 'bronze'
    },
    {
      id: 4,
      name: 'Sophie Moreau',
      photo: 'assets/images/sophie.jpg',
      gamesPlayed: 33,
      winRate: 65,
      tokens: 742,
      position: 4
    },
    {
      id: 5,
      name: 'Vous',
      photo: 'assets/images/user.jpg',
      gamesPlayed: 28,
      winRate: 61,
      tokens: 634,
      position: 5,
      badge: 'user'
    }
  ];

  completedRanking: User[] = [
    {
      id: 1,
      name: 'Alex Martin',
      photo: 'assets/images/alex.jpg',
      gamesPlayed: 45,
      winRate: 78,
      tokens: 1250,
      position: 1,
      badge: 'crown'
    },
    {
      id: 2,
      name: 'Marie Dubois',
      photo: 'assets/images/marie.jpg',
      gamesPlayed: 38,
      winRate: 72,
      tokens: 980,
      position: 2,
      badge: 'silver'
    }
  ];

  upcomingTournament: Tournament = {
    id: 1,
    name: 'Prochain tournoi',
    league: 'Tournoi Ligue 1',
    startDate: 'Commence dans 3 jours',
    participants: 24,
    isActive: true
  };
  players: any[] = [];
  currentUser : any;
  //dataSource = new MatTableDataSource<Player>([]);

  constructor(private playerService:PlayerService) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    this.loadPlayers();
  }

  loadPlayers(): void {
    this.playerService.getPlayersRanking().subscribe(players => {
      console.log('players '+JSON.stringify(players) )
      this.players = players;
      //this.dataSource = new MatTableDataSource(players);
      //this.leaguesDisplay = leagues.map(mapToLeagueDisplay);
    });
    //const employee = this.employeeService.getEmployees();
    //this.dataSource.data = employee;
    //this.dataSource = new MatTableDataSource(employee);
  }

  setActiveTab(tab: 'week' | 'month' | 'allTime'): void {
    this.activeTab = tab;
  }

  participateInTournament(): void {
    console.log('Participation au tournoi');
    // Logique de participation au tournoi
  }

  createContest(): void {
    console.log('Créer un concours');
    // Logique de création de concours
  }

  getBadgeIcon(badge?: string): string {
    switch(badge) {
      case 'crown':
        return '👑';
      case 'silver':
        return '🥈';
      case 'bronze':
        return '🥉';
      case 'user':
        return '👤';
      default:
        return '';
    }
  }

  getPodiumClass(position: number): string {
    switch(position) {
      case 1:
        return 'podium-first';
      case 2:
        return 'podium-second';
      case 3:
        return 'podium-third';
      default:
        return '';
    }
  }
}
import { Component, OnInit } from '@angular/core';

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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

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

  constructor() { }

  ngOnInit(): void {
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
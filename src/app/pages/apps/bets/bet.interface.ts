// interfaces/bet.interfaces.ts

export interface Team {
  id: string;
  name: string;
  logo?: string;
  image?: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  startDate: string;
  date: string;
  league?: {
    id: string;
    name: string;
    country: string;
  };
  status: string; // 'scheduled', 'live', 'finished'
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  imageUrl?: string;
}

export interface Bet {
  id: string;
  user: User;
  invitedUser: User;
  choice: string; // '1', 'X', '2'
  invitedChoice?: string;
  status: string; // "notstarted", "live", "finished", "postponed", "suspended"
  dateBet: string;
  responseDate?: string;
  tokenAmount: number;
  isValidated: boolean;
  match: Match;
  winner?: string;
}

export interface BetResponse {
  'hydra:member': Bet[];
  'hydra:totalItems': number;
}
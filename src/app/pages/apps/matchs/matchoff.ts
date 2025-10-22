import { League } from './league';
import { Team } from './team';

// Interface principale correspondant à l'entité Symfony Match
export interface Matchoff {
  id?: string;
  league: League | string; // Peut être l'objet complet ou juste l'ID
  homeTeam: Team; // Peut être l'objet complet ou juste l'ID
  awayTeam: Team; // Peut être l'objet complet ou juste l'ID
  date: string; // Format ISO string from API (ex: "2025-08-10T16:00:00+00:00")
  status: MatchStatus;
  isFinished: boolean;
  homeScore: number | null;
  awayScore: number | null;
}

// Enum pour les statuts de match
export enum MatchStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  FINISHED = 'finished',
  POSTPONED = 'postponed',
  CANCELLED = 'cancelled',
  SUSPENDED = 'suspended'
}

// Fonctions utilitaires
export function getMatchResult(match: Matchoff): string {
  if (!match.isFinished || match.homeScore === null || match.awayScore === null) {
    return 'vs';
  }
  return `${match.homeScore}-${match.awayScore}`;
}

export function getMatchStatusLabel(status: MatchStatus | string): string {
  const labels: Record<string, string> = {
    'scheduled': 'Programmé',
    'live': 'En cours',
    'finished': 'Terminé',
    'postponed': 'Reporté',
    'cancelled': 'Annulé',
    'suspended': 'Suspendu'
  };
  return labels[status] || status;
}

export function isMatchLive(match: Matchoff): boolean {
  return match.status === MatchStatus.LIVE;
}

export function isMatchFinished(match: Matchoff): boolean {
  return match.isFinished || match.status === MatchStatus.FINISHED;
}

export function isMatchToday(match: Matchoff): boolean {
  const matchDate = new Date(match.date);
  const today = new Date();
  return matchDate.toDateString() === today.toDateString();
}
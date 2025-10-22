import { League } from './league';

// Interface principale correspondant à l'entité Symfony Team
export interface Team {
  id?: string;
  name: string;
  country: string;
  isActive: boolean;
  image?: string;
  dateCreated: string; // Format ISO string from API (ex: "2025-08-04T23:33:11+00:00")
  league: League | string; // Peut être l'objet League complet ou juste l'ID
}
export interface League {
  id?: string;
  name: string;
  country: string;
  isActive: boolean;
  dateCreated: string; // Format ISO string from API (ex: "2025-08-04T23:33:11+00:00")
  imageUrl?: string; 
}
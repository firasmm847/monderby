import { Injectable, signal } from '@angular/core';
import { League } from 'src/app/pages/apps/matchs/league';
import { Match } from 'src/app/pages/apps/matchs/match';
import { matchs } from 'src/app/pages/apps/matchs/matchsData';
import { matchsoff } from 'src/app/pages/apps/matchs/matchsoffData';
//import { leagues } from 'src/app/pages/apps/matchs/leaguesData';
import { Matchoff } from 'src/app/pages/apps/matchs/matchoff';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';


interface ApiResponse<T> {
  'hydra:member': T[];
  'hydra:totalItems': number;
  'hydra:view'?: {
    '@id': string;
    'hydra:first'?: string;
    'hydra:last'?: string;
    'hydra:previous'?: string;
    'hydra:next'?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class MatchService {
  private matchs = signal<Match[]>(matchs);
  private matchsoff = signal<Matchoff[]>(matchsoff);
  //private leagues = signal<League[]>(leagues);
  leagues: League[] = [];
  auth_token: any;

  // BehaviorSubjects pour les observables
  private leaguesSubject = new BehaviorSubject<League[]>([]);
  private matchsSubject = new BehaviorSubject<Matchoff[]>([]);

  constructor(private http: HttpClient) {
    this.auth_token = localStorage.getItem('token');
  }


  public getMatchs(): Match[] {
    return this.matchs();
  }
  public getMatchsoff(): Matchoff[] {
    return this.matchsoff();
  }

  /*public getMatchsByLeagueId(leagueId: string): Matchoff[] {
    return matchsoff.filter(match => match.league === leagueId);
  }*/
  /*
  public getLeagues(): League[] {
    return this.leagues();
  }*/

  public getAllMatchsToday(): Observable<Matchoff[]> {
    return this.http.get<ApiResponse<Matchoff>>(`${environment.API_URL}/allmatchs`).pipe(
      map(response => response['hydra:member'])
    );
  }

  public getLeagues(): Observable<League[]> {
    
    const headers = new HttpHeaders({
     'Content-Type': 'application/json',
     'Authorization': `Bearer ${this.auth_token}`
    });
   
    const requestOptions = { headers: headers };
    return this.http.get<ApiResponse<League>>(`${environment.API_URL}/leagues`, requestOptions).pipe(
      map(response => response['hydra:member']),
      tap(leagues => {
        return leagues;
      })
    );
  }

  public getAllMatchs(page: number = 1, perPage: number = 200): Observable<Matchoff[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth_token}`
    });

    // Construire les paramètres pour filtrer par league
    const params = new HttpParams()
      .set('page', page.toString())
      .set('perPage', perPage.toString());

    const requestOptions = { headers: headers, params: params };
    const now = new Date().toISOString();

    return this.http.get<ApiResponse<Matchoff>>(`${environment.API_URL}/matches?date[strictly_after]=${now}`, requestOptions).pipe(
      map(response => response['hydra:member']),
      tap(matches => {
        console.log('All Matches loaded', matches);
      })
    );
  }

  public getMatchsByLeagueId(leagueId: string, page: number = 1, perPage: number = 30): Observable<Matchoff[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth_token}`
    });


    // Construire les paramètres pour filtrer par league
    const params = new HttpParams()
      .set('page', page.toString())
      .set('perPage', perPage.toString())
      .set('league[]', leagueId); // Symfony attend league[] pour le filtre

    const requestOptions = { headers: headers, params: params };
    const now = new Date().toISOString();

    return this.http.get<ApiResponse<Matchoff>>(`${environment.API_URL}/matches?date[strictly_after]=${now}`, requestOptions).pipe(
      map(response => response['hydra:member']),
      tap(matches => {
        console.log(`Matches loaded for league ${leagueId}:`, matches);
      })
    );
  }

  // Version alternative si vous voulez aussi la réponse complète avec pagination
  public getMatchsByLeagueIdWithPagination(leagueId: string, page: number = 1, perPage: number = 30): Observable<ApiResponse<Matchoff>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.auth_token}`
    });

    const params = new HttpParams()
      .set('page', page.toString())
      .set('perPage', perPage.toString())
      .set('league[]', leagueId);

    const requestOptions = { headers: headers, params: params };

    return this.http.get<ApiResponse<Matchoff>>(`${environment.API_URL}/matches`, requestOptions).pipe(
      tap(response => {
        console.log(`API Response for league ${leagueId}:`, response);
      })
    );
  }

  // Si vous voulez garder une version qui filtre depuis le cache local (pour usage offline)
  public getMatchsByLeagueIdFromCache(leagueId: string): Observable<Matchoff[]> {
    return this.matchsSubject.asObservable().pipe(
      map(matches => matches.filter(match => 
        typeof match.league === 'object' ? match.league.id === leagueId : match.league === leagueId
      ))
    );
  }

  // Méthodes synchrones pour compatibilité (utilise le cache)
  public getLeaguesSync(): League[] {
    return this.leagues;
  }

  public getMatchsoffSync(): Matchoff[] {
    return this.matchsoff();
  }

  public getMatchsSync(): Match[] {
    return this.matchs();
  }

  public addMatch(match: Match) {
    this.matchs.update((currentNotes) => [match, ...currentNotes]);
  }

  public removeMatch(match: Match) {
    this.matchs.update((currentMatchs) => currentMatchs.filter((n) => n !== match));
  }

  public removeLeague(league: League) {
    //this.leagues.update((currentLeagues) => currentLeagues.filter((n) => n !== league));
  }

  public updateMatch(updatedMatch: Match): void {
    this.matchs.update(
      (currentMatchs) =>
        currentMatchs.map((n) =>
          n.title === updatedMatch.title ? updatedMatch : n
        )
    );
  }
}

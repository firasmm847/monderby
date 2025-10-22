import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Bet, BetResponse } from 'src/app/pages/apps/bets/bet.interface';
import { Contact } from 'src/app/pages/apps/contact/contact';
import { contactList } from 'src/app/pages/apps/contact/contactData';
import { environment } from 'src/environments/environment';



export interface CreateBetRequest {
  type: 'match' | 'custom';
  matchId?: string;
  objective?: string;
  maxAmount?: number;
  deadline: string;
  tokenAmount: number;
  invitedUsers: string[];
}

export interface AcceptBetRequest {
  betId: string;
  choice?: string;
}

export interface ValidateWinnerRequest {
  betId: string;
  winnerId: string;
}

@Injectable({
  providedIn: 'root',
})
export class BetService {
  currentUser: any = null;
  httpOptions: any;

  httpOptionsR() {
    if (this.currentUser !== null) {
      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.currentUser['token']
        })
      };
    }
    return this.httpOptions;
  }

  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + this.currentUser['token'],
      'Content-Type': 'application/json'
    });
  }

  // Récupérer tous les paris de l'utilisateur connecté (créés + invités)
  getUserBetsFinished(): Observable<BetResponse> {
    let options = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.currentUser['token']
      })
    };
    return this.http.get<BetResponse>(`${this.apiUrl}/bets?status=finished&answered=answered`, options);
  }

  // Récupérer tous les paris de l'utilisateur connecté (créés + invités)
  getUserBetsPending(userId: string) {
    let options = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.currentUser['token']
      })
    };
    return this.http.get<any>(`${this.apiUrl}/notifications?usernotified=${userId}&order[date]=desc`, options);
    //return this.http.get<any>(`${this.apiUrl}/bets?status=notstarted&invitedUser=${userId}`, options);
  }

  // Récupérer tous les paris de l'utilisateur connecté (créés + invités)
  getUserBets(): Observable<BetResponse> {
    let options = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.currentUser['token']
      })
    };
    return this.http.get<BetResponse>(`${this.apiUrl}/bets?order[dateBet]=desc`, options);
  }

  // Récupérer les paris créés par l'utilisateur
  getCreatedBets(): Observable<BetResponse> {
    const params = new HttpParams().set('user', this.getCurrentUserId());
    return this.http.get<BetResponse>(`${this.apiUrl}/bets?order[dateBet]=desc`, { params });
  }

  // Récupérer les paris où l'utilisateur est invité
  getInvitedBets(): Observable<BetResponse> {
    const params = new HttpParams().set('invitedUser', this.getCurrentUserId());
    return this.http.get<BetResponse>(`${this.apiUrl}/bets?order[dateBet]=desc`, { params });
  }

  // Accepter un pari (pour l'utilisateur invité)
  updateBet(betId: string, choice: string): Observable<Bet> {
    let options = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.currentUser['token']
      })
    };
    return this.http.put<Bet>(`${this.apiUrl}/bets/${betId}/respond?choice=`+choice, {
    }, options);
  }

  // Accepter un pari (pour l'utilisateur invité)
  updateResponseBet(betId: string, choice: string): Observable<Bet> {
    let options = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.currentUser['token']
      })
    };
    return this.http.put<Bet>(`${this.apiUrl}/bets/${betId}/respond?choice=`+choice, {
    }, options);
  }

  // Rejeter un pari
  rejectBet(betId: string): Observable<Bet> {
    let options = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.currentUser['token']
      })
    };
    return this.http.put<Bet>(`${this.apiUrl}/bets/${betId}`, {
      answered: '',
      responseDate: new Date().toISOString()
    }, options);
  }

  private getCurrentUserId(): string {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return currentUser.id;
  }

  /**
   * Créer un nouveau pari (match ou custom)
   */
  createBet(betData: CreateBetRequest): Observable<any> {
    const options = {
      headers: this.getHeaders()
    };

    const payload = {
      type: betData.type,
      deadline: betData.deadline,
      tokenAmount: betData.tokenAmount,
      invitedUsers: betData.invitedUsers,
      ...(betData.type === 'match' ? {
        matchId: betData.matchId
      } : {
        objective: betData.objective,
        maxAmount: betData.maxAmount
      })
    };

    return this.http.post(`${this.apiUrl}/bets/create`, payload, options);
  }

  /**
   * Récupérer tous les paris
   */
  getAllBets(): Observable<any> {
    const options = {
      headers: this.getHeaders()
    };
    return this.http.get(`${this.apiUrl}/bets`, options);
  }

  /**
   * Récupérer mes paris (créés + participations)
   */
  getMyBets(): Observable<any> {
    const options = {
      headers: this.getHeaders()
    };
    return this.http.get(`${this.apiUrl}/bets/my-bets`, options);
  }

  /**
   * Récupérer un pari par ID
   */
  getBetById(betId: string): Observable<any> {
    const options = {
      headers: this.getHeaders()
    };
    return this.http.get(`${this.apiUrl}/bets/${betId}`, options);
  }

  /**
   * Accepter un pari et payer les 10 tokens
   */
  acceptBet(betId: string, choice?: string): Observable<any> {
    const options = {
      headers: this.getHeaders(),
      params: choice ? new HttpParams().set('choice', choice) : undefined
    };

    return this.http.post(`${this.apiUrl}/bets/${betId}/accept`, {}, options);
  }

  /**
   * Refuser un pari
   */
  refuseBet(betId: string): Observable<any> {
    const options = {
      headers: this.getHeaders()
    };
    return this.http.post(`${this.apiUrl}/bets/${betId}/refuse`, {}, options);
  }

  /**
   * Valider le gagnant (créateur uniquement)
   */
  validateWinner(betId: string, winnerId: string): Observable<any> {
    const options = {
      headers: this.getHeaders(),
      params: new HttpParams().set('winnerId', winnerId)
    };

    return this.http.post(`${this.apiUrl}/bets/${betId}/validate-winner`, {}, options);
  }

  /**
   * Supprimer un pari
   */
  deleteBet(betId: string): Observable<any> {
    const options = {
      headers: this.getHeaders()
    };
    return this.http.delete(`${this.apiUrl}/bets/${betId}`, options);
  }

  /**
   * Récupérer les participants d'un pari
   */
  getBetParticipants(betId: string): Observable<any> {
    const options = {
      headers: this.getHeaders()
    };
    return this.http.get(`${this.apiUrl}/bet_participants?bet=${betId}`, options);
  }

  /**
   * Vérifier si l'utilisateur peut valider le gagnant
   */
  canValidateWinner(bet: any): boolean {
    const currentUserId = this.currentUser['id'];
    return bet.creator?.id === currentUserId && 
           bet.status === 'open' && 
           new Date(bet.deadline) < new Date();
  }

  /**
   * Vérifier si l'utilisateur a déjà participé
   */
  hasUserParticipated(bet: any): boolean {
    const currentUserId = this.currentUser['id'];
    return bet.participants?.some((p: any) => 
      p.user?.id === currentUserId && 
      (p.status === 'accepted' || p.status === 'pending')
    );
  }

  /**
   * Obtenir le statut de participation de l'utilisateur
   */
  getUserParticipationStatus(bet: any): string | null {
    const currentUserId = this.currentUser['id'];
    const participation = bet.participants?.find((p: any) => p.user?.id === currentUserId);
    return participation?.status || null;
  }

  /**
   * ANCIENNE MÉTHODE - Garder pour compatibilité
   * @deprecated Utiliser createBet à la place
   */
  createBetOld(betData: any): Observable<any> {
    const options = {
      headers: this.getHeaders()
    };
    
    const payload = {
      user: betData.user,
      invitedUser: betData.invitedUser,
      choice: betData.choice,
      tokenAmount: betData.tokenAmount,
      match: betData.match,
      status: 'notstarted',
      dateBet: new Date().toISOString(),
      isValidated: false
    };

    return this.http.post(`${this.apiUrl}/bets`, payload, options);
  }
}
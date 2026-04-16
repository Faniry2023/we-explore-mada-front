import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UtilisateurModel } from '../../models/utilisateur-model';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilisateurService {
  private httpClient = inject(HttpClient);
  private baseUrl = "https://localhost:7129/";

  public login(model: UtilisateurModel):Observable<boolean>{
    return this.httpClient.post<boolean>(this.baseUrl + 'login',model,{withCredentials:true})
    .pipe(catchError(this.handleError));
  }

  public me():Observable<boolean>{
    return this.httpClient.get<boolean>(this.baseUrl + 'me',{withCredentials:true})
    .pipe(catchError(this.handleError));
  }

  public logout():Observable<void>{
    return this.httpClient.post<void>(this.baseUrl + 'logout',{},{withCredentials:true})
    .pipe(catchError(this.handleError));
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error?.title && error.error?.detail) {
      // Erreur ProblemDetails (provenant de .NET 8)
      return throwError(() => ({
        status: error.status,
        title: error.error.title,
        detail: error.error.detail
      }));
    }
    // Erreur générique
    return throwError(() => ({
      status: error.status,
      title: "Erreur inconnue",
      detail: "Une erreur inattendue est survenue."
    }));
  }
}

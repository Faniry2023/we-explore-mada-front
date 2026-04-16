import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ProduitModel } from '../../models/produit-model';

@Injectable({
  providedIn: 'root',
})
export class ProduitService {
  private httpClient = inject(HttpClient);
  private baseUrl = "https://localhost:7129/";

  getAllProd():Observable<ProduitModel[]>{
    return this.httpClient.get<ProduitModel[]>(this.baseUrl + 'all/prod',{withCredentials:true})
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

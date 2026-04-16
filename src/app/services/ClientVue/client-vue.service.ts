import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { VuePartie } from '../../helper/vue-partie';
import { RtrImageHelper } from '../../helper/rtr-image-helper';
import { SiteModel } from '../../models/site-model';

@Injectable({
  providedIn: 'root',
})
export class ClientVueService {
  private httpClient = inject(HttpClient);
  private baseUrl = "https://localhost:7129/";

  getAll(id_prod: string):Observable<VuePartie[]>{
    return this.httpClient.get<VuePartie[]>(this.baseUrl + 'init/get/all/' + id_prod, {withCredentials:true})
    .pipe(catchError(this.handleError));
  }

  getImage(id_prop: string):Observable<RtrImageHelper>{
    return this.httpClient.get<RtrImageHelper>(this.baseUrl + 'vu/select/img/' + id_prop, {withCredentials: true})
    .pipe(catchError(this.handleError));
  }

  getSite(id_ville: string):Observable<SiteModel>{
    return this.httpClient.get<SiteModel>(this.baseUrl + 'select/site/vu/'+ id_ville,{withCredentials:true})
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

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { PartieVilleHelper } from '../../helper/partie-ville-helper';
import { VuePartie } from '../../helper/vue-partie';

@Injectable({
  providedIn: 'root',
})
export class PartieService {
  private httpClient = inject(HttpClient);
  private baseUrl = "https://localhost:7129/";

  add(model: PartieVilleHelper,isUpdate: boolean):Observable<VuePartie>{
    if(isUpdate){
    return this.httpClient.put<VuePartie>(this.baseUrl + 'partie/update', model, {withCredentials:true})
    .pipe(catchError(this.handleError));
    }else{
      console.log(model)
      return this.httpClient.post<VuePartie>(this.baseUrl + 'partie/add', model, {withCredentials:true})
      .pipe(catchError(this.handleError));
    }
  }
  getAll():Observable<VuePartie[]>{
    return this.httpClient.get<VuePartie[]>(this.baseUrl + 'partie/get/all', {withCredentials:true})
    .pipe(catchError(this.handleError));
  }
  delete(id_partie: string):Observable<void>{
    return this.httpClient.delete<void>(this.baseUrl + 'partie/delete/' + id_partie,{withCredentials:true})
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

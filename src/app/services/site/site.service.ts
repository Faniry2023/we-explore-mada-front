import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SiteModel } from '../../models/site-model';
import { catchError, Observable, throwError } from 'rxjs';
import { SiteEtImage } from '../../helper/site-et-image';

@Injectable({
  providedIn: 'root',
})
export class SiteService {
  private httpClient = inject(HttpClient);
  private baseUrl = "https://localhost:7129/";

  add(model: SiteModel, files: File[],isUpdate: boolean):Observable<SiteModel>{
    const formData = new FormData();
    formData.append("site",JSON.stringify(model));
    files.forEach(file => { formData.append("images",file);})
    if(isUpdate){
      return this.httpClient.put<SiteModel>(this.baseUrl + 'site/update',formData,{withCredentials:true})
    .pipe(catchError(this.handleError));
    }
    return this.httpClient.post<SiteModel>(this.baseUrl + 'site/ajout',formData,{withCredentials:true})
    .pipe(catchError(this.handleError));
  }

  getAll():Observable<SiteModel[]>{
    return this.httpClient.get<SiteModel[]>(this.baseUrl + 'site/getAll')
    .pipe(catchError(this.handleError));
  }

  getOne(id: string):Observable<SiteEtImage>{
    return this.httpClient.get<SiteEtImage>(this.baseUrl + 'site/select/'+id, {withCredentials:true})
    .pipe(catchError(this.handleError));
  }

  delete(id: string):Observable<void>{
    return this.httpClient.delete<void>(this.baseUrl + 'site/delete/' + id, {withCredentials:true})
    .pipe(catchError(this.handleError))
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

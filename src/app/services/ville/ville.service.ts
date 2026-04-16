import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { VilleModel } from '../../models/ville-model';
import { VilleEtImages } from '../../helper/ville-et-images';

@Injectable({
  providedIn: 'root',
})
export class VilleService {
  private httpClient = inject(HttpClient);
  private baseUrl = "https://localhost:7129/";

  add(model: VilleModel, files: File[],isUpdate: boolean):Observable<VilleModel>{
    const formData = new FormData();
    formData.append("ville",JSON.stringify(model));
    files.forEach(file => { formData.append("images",file);})
    if(isUpdate){
      return this.httpClient.put<VilleModel>(this.baseUrl + 'ville/update',formData,{withCredentials:true})
      .pipe(catchError(this.handleError));
    }
    return this.httpClient.post<VilleModel>(this.baseUrl + 'ville/ajout',formData,{withCredentials:true})
    .pipe(catchError(this.handleError));
  }

  getAll():Observable<VilleModel[]>{
    return this.httpClient.get<VilleModel[]>(this.baseUrl + 'ville/getAll')
    .pipe(catchError(this.handleError));
  }

  getOne(id: string):Observable<VilleEtImages>{
    return this.httpClient.get<VilleEtImages>(this.baseUrl + 'ville/select/'+id, {withCredentials:true})
    .pipe(catchError(this.handleError));
  }

    delete(id: string):Observable<void>{
    return this.httpClient.delete<void>(this.baseUrl + 'ville/delete/' + id, {withCredentials:true})
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

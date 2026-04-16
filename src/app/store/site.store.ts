import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { SiteEtImage } from "../helper/site-et-image";
import { SiteModel } from "../models/site-model";
import { inject } from "@angular/core";
import { SiteService } from "../services/site/site.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { firstValueFrom } from "rxjs";


export interface SiteState{
    site: SiteModel | null;
    sites: SiteModel[];
    siteEtImage: SiteEtImage | null;
    loading: boolean;
    isError: boolean;
}

const initialState: SiteState = {
    site: null,
    sites: [] as SiteModel[],
    siteEtImage: null,
    loading: false,
    isError: false,
}

export const SiteStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store,
        service = inject(SiteService),
        snackBar = inject(MatSnackBar),
    ) => ({
        async Add(model: SiteModel, files: File[], isUpdate: boolean){
            patchState(store,{loading:true});
            try{
                const newVille = await firstValueFrom(service.add(model,files,isUpdate));
                
                if(isUpdate){
                    patchState(store,{loading:false,sites:[newVille,...store.sites().filter(s => s.id.toUpperCase() !== model.id.toUpperCase())]});
                    snackBar.open('Modification ok', 'Fermer', {
                        duration: 10000,
                    });
                }else{
                    patchState(store,{loading:false,sites:[newVille,...(store.sites() ?? [])]});
                    snackBar.open('Enregistrement ok', 'Fermer', {
                        duration: 10000,
                    });
                }
            }catch(err:any){
                const msrError = err?.detail;
                patchState(store,{loading:false, isError:true});
                    snackBar.open(msrError, 'Fermer', {
                        duration: 10000,
                        panelClass: 'error-snackbar'
                    });
            }
        },
        async getAll(){
            patchState(store,{loading:true});
            try{
                var liste_ville = await firstValueFrom(service.getAll());
                patchState(store,{loading:false,sites:liste_ville});
            }catch(err:any){
                const msrError = err?.detail;
                patchState(store,{loading:false, isError:true});
                    snackBar.open(msrError, 'Fermer', {
                        duration: 10000,
                        panelClass: 'error-snackbar'
                    });
            }
        },
        async getSelect(id_ville: string){
            patchState(store,{loading:true,siteEtImage:null});
            try{
                var siteEtImage = await firstValueFrom(service.getOne(id_ville));
                // siteEtImage.images = siteEtImage.images.map(img =>({
                //     ...img,
                //     path_image:'data:image/png;base64,'+img.path_image
                // }));
                // console.log(siteEtImage.images);
                patchState(store,{loading:false,siteEtImage:siteEtImage});
            }catch(err:any){
                const msrError = err?.detail;
                patchState(store,{loading:false, isError:true});
                    snackBar.open(msrError, 'Fermer', {
                        duration: 10000,
                        panelClass: 'error-snackbar'
                    });
            }
        },
        async delete(id_site: string){
            patchState(store,{loading:true,siteEtImage:null});
            try{
                await firstValueFrom(service.delete(id_site));
                const newliste = store.sites().filter(s => s.id.toUpperCase() !== id_site.toUpperCase());
                patchState(store,{loading:false,sites:newliste});
                    snackBar.open('Suppression OK', 'Fermer', {
                        duration: 10000,
                    });
            }catch(err:any){
                const msrError = err?.detail;
                patchState(store,{loading:false, isError:true});
                    snackBar.open(msrError, 'Fermer', {
                        duration: 10000,
                        panelClass: 'error-snackbar'
                    });
            }
        },
    }))
)
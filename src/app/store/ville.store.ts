import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { VilleEtImages } from "../helper/ville-et-images";
import { VilleModel } from "../models/ville-model";
import { inject, model } from "@angular/core";
import { VilleService } from "../services/ville/ville.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { firstValueFrom } from "rxjs";
import { ToastrService } from "ngx-toastr";

export interface VilleState{
    ville: VilleModel | null;
    villes: VilleModel[];
    villeEtImage: VilleEtImages | null;
    loading: boolean;
    isError: boolean;
    def_spe_temps:any;
}

const initialState: VilleState = {
    ville: null,
    villes: [] as VilleModel[],
    villeEtImage: null,
    loading: false,
    isError: false,
    def_spe_temps: {},
}

export const VilleStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store,
        service = inject(VilleService),
        snackBar = inject(MatSnackBar),
        toastr = inject(ToastrService),
    ) => ({
        async Add(model: VilleModel, files: File[],isUpdate: boolean){
            patchState(store,{loading:true});
            try{
                const newVille = await firstValueFrom(service.add(model,files,isUpdate));
                
                if(isUpdate){
                    patchState(store,{loading:false,villes:[newVille,...store.villes().filter(v => v.id.toUpperCase() !== model.id.toUpperCase())]});
                    snackBar.open('Modification ok', 'Fermer', {
                        duration: 10000,
                    });
                }else{
                    patchState(store,{loading:false,villes:[newVille,...(store.villes() ?? [])]});
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
        addDefSpe(nom: string, valeur: string){
            patchState(store,{
                def_spe_temps:{
                    ...store.def_spe_temps(),
                    [nom]:valeur
                }
            })
        },
        delOneDef(key: string){
            const current = {...store.def_spe_temps()};
            delete current[key];
            patchState(store,{def_spe_temps:current});   
        },
        delAllDef(){
            patchState(store,{def_spe_temps:{}});   
        },
        async getAll(){
            patchState(store,{loading:true});
            try{
                var liste_ville = await firstValueFrom(service.getAll());
                patchState(store,{loading:false,villes:liste_ville});
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
            patchState(store,{loading:true,villeEtImage:null,def_spe_temps:{}});
            try{
                
                var villeEtImage = await firstValueFrom(service.getOne(id_ville));
              
                var obj = JSON.parse(villeEtImage.villes.des_spe);
             
                // siteEtImage.images = siteEtImage.images.map(img =>({
                //     ...img,
                //     path_image:'data:image/png;base64,'+img.path_image
                // }));
                console.log(villeEtImage);
                patchState(store,{loading:false,villeEtImage:villeEtImage, def_spe_temps:obj});
            }catch(err:any){
                const msrError = err?.detail;
                patchState(store,{loading:false, isError:true});
                    snackBar.open(msrError, 'Fermer', {
                        duration: 10000,
                        panelClass: 'error-snackbar'
                    });
            }
        },
        async delete(id_ville: string){
            patchState(store,{loading:true,villeEtImage:null,def_spe_temps:{}});
            try{
                
                await firstValueFrom(service.delete(id_ville));
                const newliste = store.villes().filter(v => v.id.toUpperCase() !== id_ville.toUpperCase());
                patchState(store,{loading:false,villes:newliste});
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
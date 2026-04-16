import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { firstValueFrom } from "rxjs";
import { VuePartie } from "../helper/vue-partie";
import { PartieService } from "../services/partie/partie.service";
import { PartieVilleHelper } from "../helper/partie-ville-helper";


export interface PartieState{
    liste_vue_partie: VuePartie[];
    vue_partie: VuePartie | null;
    loading: boolean;
    isError: boolean;
    newTemps: VuePartie | null;
}

const initialState: PartieState = {
    liste_vue_partie: [],
    vue_partie: null,
    loading: false,
    isError: false,
    newTemps: null,
}

export const PartieStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store,
        service = inject(PartieService),
        snackBar = inject(MatSnackBar),
    ) => ({
        async Add(model: PartieVilleHelper, isUpdate: boolean){
            patchState(store,{loading:true});
            try{
                const vue_partie_n = await firstValueFrom(service.add(model,isUpdate));
                // console.log(vue_partie_n)
                if(isUpdate){
                     patchState(store,{loading:false,newTemps:vue_partie_n,liste_vue_partie:[vue_partie_n,...store.liste_vue_partie().filter(v => v.partie.id.toUpperCase() !== model.partie.id.toUpperCase())]});
                    snackBar.open('Modification ok', 'Fermer', {
                        duration: 10000,
                    });
                }else{
                    patchState(store,{loading:false, newTemps:vue_partie_n,liste_vue_partie:[vue_partie_n,...(store.liste_vue_partie() ?? [])]});
                    // console.log('store ato')
                    // console.log(vue_partie_n)
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
                var liste_partie = await firstValueFrom(service.getAll());
                
                patchState(store,{loading:false,liste_vue_partie:liste_partie});
            }catch(err:any){
                const msrError = err?.detail;
                patchState(store,{loading:false, isError:true});
                    snackBar.open(msrError, 'Fermer', {
                        duration: 10000,
                        panelClass: 'error-snackbar'
                    });
            }
        },
        async delete(id_partie: string){
            patchState(store,{loading:true,vue_partie:null});
            try{
                await firstValueFrom(service.delete(id_partie));
                const newliste = store.liste_vue_partie().filter(v => v.partie.id.toUpperCase() !== id_partie.toUpperCase());
                patchState(store,{loading:false,liste_vue_partie:newliste});
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
        async selectOnVue(id: string){
            patchState(store,{loading:true,vue_partie:null});
            try{
                const vu = store.liste_vue_partie().find(v => v.partie.id.toUpperCase() == id.toUpperCase());
                patchState(store,{loading:false,vue_partie:vu});
            }catch(err:any){
                const errorMessage = err?.detail;
                patchState(store, {loading : false, isError : true});
                patchState(store,{loading:false, isError:true});
                    snackBar.open(err, 'Fermer', {
                        duration: 10000,
                        panelClass: 'error-snackbar'
                    });
            }
        }
    }))
)
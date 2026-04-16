import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { inject } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { firstValueFrom } from "rxjs";
import { VuePartie } from "../helper/vue-partie";
import { RtrImageHelper } from "../helper/rtr-image-helper";
import { ClientVueService } from "../services/ClientVue/client-vue.service";
import { VilleModel } from "../models/ville-model";
import { SiteModel } from "../models/site-model";


export interface ClientState{
    liste_vue_partie: VuePartie[];
    vue_partie: VuePartie | null;
    liste_image: RtrImageHelper | null;
    villeSelect: VilleModel | null;
    siteSelect: SiteModel | null;
    loading: boolean;
    isError: boolean;
    loadingImg: boolean;
    def_spe_temps: any;
}

const initialState: ClientState = {
    liste_vue_partie: [],
    vue_partie: null,
    liste_image: null,
    villeSelect: null,
    siteSelect: null,
    loading: false,
    isError: false,
    loadingImg: false,
    def_spe_temps: {}
}

export const ClientStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store,
        service = inject(ClientVueService),
        snackBar = inject(MatSnackBar),
    ) => ({
        
        async getAll(id_prod: string){
            patchState(store,{loading:true, vue_partie:null, villeSelect:null});
            try{
                var liste_partie = await firstValueFrom(service.getAll(id_prod));
                if(liste_partie.length > 0){
                    patchState(store,{vue_partie:liste_partie[0]});
                }
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
        async methVilleSelect(id: string){
            patchState(store,{loading:true,villeSelect:null});
            try{
                const vu = store.vue_partie()?.villes.find(v => v.id.toUpperCase() == id.toUpperCase());
                if(vu){
                    const def = JSON.parse(vu.des_spe);
                    patchState(store,{loading:false,villeSelect:vu,def_spe_temps:def});
                }
                
            }catch(err:any){
                const errorMessage = err?.detail;
                patchState(store, {loading : false, isError : true});
                patchState(store,{loading:false, isError:true});
                    snackBar.open(err, 'Fermer', {
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
        },
        async getImages(id_prop: string){
            patchState(store,{liste_image:null,loadingImg:true});
            try{
                const rtr = await firstValueFrom(service.getImage(id_prop));
                patchState(store,{liste_image:rtr,loadingImg:false})
            }catch(err:any){
                const errorMessage = err?.detail;
                patchState(store, {loadingImg : false, isError : true});
                    snackBar.open(err, 'Fermer', {
                        duration: 10000,
                        panelClass: 'error-snackbar'
                    });
            }
        },
        async getSite(id_ville: string){
            patchState(store,{siteSelect:null,loadingImg:true});
            try{
                const site = await firstValueFrom(service.getSite(id_ville));
                patchState(store,{siteSelect:site,loadingImg:false});
            }catch(err:any){
                const errorMessage = err?.detail;
                patchState(store, {loadingImg : false, isError : true});
                 
            }
        }
    }))
)
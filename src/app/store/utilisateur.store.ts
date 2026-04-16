import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { UtilisateurModel } from "../models/utilisateur-model";
import { inject } from "@angular/core";
import { UtilisateurService } from "../services/utilisateur/utilisateur.service";
import { firstValueFrom } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";

export interface UtilisateurState{
    utilisateur: UtilisateurModel | null;
    loading: boolean;
    isError: boolean;
    error: string | null;
    succes: boolean;
}

const initialState: UtilisateurState = {
    utilisateur: null,
    loading: false,
    isError: false,
    error: null,
    succes: false,
}

export const UtilisateurStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store,
        service = inject(UtilisateurService),
        snackBar = inject(MatSnackBar)
    ) => ({
        async Login(model: UtilisateurModel){
            patchState(store,{loading:true});
            try{
                
                const reponse = await firstValueFrom(service.login(model));
                patchState(store,{loading:false, succes:reponse});
                alert("vita ny ato")
            }catch(err:any){
                const msgError = err?.detail;
                patchState(store,{loading:false,isError:true,error:msgError});
                snackBar.open(msgError,'Fermer',{duration:10000});
            }
        },
        async Me(){
            patchState(store,{loading:true});
            try{
                const reponse = await firstValueFrom(service.me());
                patchState(store,{loading:false})
            }catch(err:any){
                const msgError = err?.detail;
                patchState(store,{loading:false,isError:true,error:msgError});   
            }
        },
        async Logout(){
            patchState(store,{loading:true})
            try{
                await firstValueFrom(service.logout());
                patchState(store,{loading:false});
                snackBar.open("Déconnexion réuissi",'Fermer',{duration:10000});
            }catch(err:any){
                const msgError = err?.detail;
                patchState(store,{loading:false,isError:true,error:msgError});
                snackBar.open(msgError,'Fermer',{duration:10000});
            }
        }
    }))
)
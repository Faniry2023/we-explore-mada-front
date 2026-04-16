import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { ProduitModel } from "../models/produit-model";
import { inject } from "@angular/core";
import { ProduitService } from "../services/prodtui/produit.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { firstValueFrom } from "rxjs";

export interface ProduitState{
    produit: ProduitModel | null;
    produits: ProduitModel[];
    loading: boolean;
    isError: boolean;
}

const initialState: ProduitState = {
    produit: null,
    produits: [] as ProduitModel[],
    loading: false,
    isError: false
}

export const ProduitStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store,
        service = inject(ProduitService),
        snackBar = inject(MatSnackBar)
    ) => ({
        async GetAllProd(){
            patchState(store,{loading:true});
            try{
                const prods = await firstValueFrom(service.getAllProd());
                patchState(store,{loading:false, produits:prods});
            }catch(err:any){
                const msgError = err?.detail;
                patchState(store,{loading:false,isError:true});
                snackBar.open(msgError,'Fermer',{duration:10000,panelClass: 'error-snackbar'});
            }
        }
    }))
)
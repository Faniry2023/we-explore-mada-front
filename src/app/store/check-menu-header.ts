import { inject } from "@angular/core";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { MatSnackBar } from "@angular/material/snack-bar";

export interface MenuState{
    menu:'home'|'rate'|'about'|'contact'
}
const initialState:MenuState ={
    menu:'home',
}
export const MenuStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store)=> ({
        setMenu(menu:'home'|'rate'|'about'|'contact'){
            patchState(store,{menu:menu});
            localStorage.setItem('menu',menu);
        }
    }))
)

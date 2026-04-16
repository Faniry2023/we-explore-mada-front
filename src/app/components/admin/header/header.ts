import { Component, inject } from '@angular/core';
import { UtilisateurStore } from '../../../store/utilisateur.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private utilisateurStore = inject(UtilisateurStore);
  private router = inject(Router);

  async logout(){
    await this.utilisateurStore.Logout();
    if(!this.utilisateurStore.isError()){
      this.router.navigate(['we-explore-mada/part/one/admin/login'],
        {
          replaceUrl:true
        }
      )
    }
  }
}

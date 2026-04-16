import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UtilisateurStore } from '../../../store/utilisateur.store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UtilisateurModel } from '../../../models/utilisateur-model';
import { MatProgressSpinner } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,MatProgressSpinner],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);
  utilisateurStore = inject(UtilisateurStore);
  private fb = inject(FormBuilder);
  form = this.fb.group({
    identifiant:['',Validators.required],
    mdp:['',Validators.required]
  });

  async login(){
    
    if(this.form.invalid) return;
    const utilisateurModel:UtilisateurModel = {
      id:'',
      nom_utilisateur:this.form.value.identifiant!,
      email:this.form.value.identifiant!,
      mdp:this.form.value.mdp!,
    }

    await this.utilisateurStore.Login(utilisateurModel);
    if(!this.utilisateurStore.isError()){
      
      this.router.navigate(['/we-explore-mada/part/one/admin'],
        {
          replaceUrl:true
        }
      );
    }
  }
}

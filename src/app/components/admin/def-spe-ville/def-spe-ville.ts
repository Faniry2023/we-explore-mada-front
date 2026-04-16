import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VilleStore } from '../../../store/ville.store';

@Component({
  selector: 'app-def-spe-ville',
  imports: [ReactiveFormsModule],
  templateUrl: './def-spe-ville.html',
  styleUrl: './def-spe-ville.css',
})
export class DefSpeVille {
  constructor(private dialogRef:MatDialogRef<DefSpeVille>, @Inject(MAT_DIALOG_DATA) public data:any){}
  private fb = inject(FormBuilder);
  villeStore = inject(VilleStore);
  form = this.fb.group({
    nom: ['',[Validators.required]],
    valeur: ['',[Validators.required]],
  })
 
  save(){
    this.villeStore.addDefSpe(this.form.value.nom!,this.form.value.valeur!);
    this.dialogRef.close();
  }
}

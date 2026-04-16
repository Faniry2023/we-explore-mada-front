import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-prod',
  imports: [],
  templateUrl: './add-prod.html',
  styleUrl: './add-prod.css',
})
export class AddProd {
  constructor(private dialogRef:MatDialogRef<AddProd>, @Inject(MAT_DIALOG_DATA) public data:any){}
}

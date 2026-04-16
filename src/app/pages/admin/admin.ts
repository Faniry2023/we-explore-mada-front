import { Component } from '@angular/core';
import { Prod } from '../../components/admin/prod/prod';

@Component({
  selector: 'app-admin',
  imports: [Prod],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {

}

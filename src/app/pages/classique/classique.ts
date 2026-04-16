import { Component, signal } from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from "../../components/footer/footer";
import {ReactiveFormsModule} from "@angular/forms";
import{MatButtonToggleModule} from '@angular/material/button-toggle';

@Component({
  selector: 'app-classique',
  imports: [Header, Footer, ReactiveFormsModule,MatButtonToggleModule],
  templateUrl: './classique.html',
  styleUrl: './classique.css',
})
export class Classique {
  data_type = signal<string>("");
  imgSelect = signal(0);
  images = [
    'test/baobab.jpg',
    'test/isalo.jpg',
    'test/kon.jpg',
    'test/nosybe.jpg'
  ]
  changeImage(ref:number){
    this.imgSelect.set(ref);
  }
}

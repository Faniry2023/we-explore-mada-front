import { Component, inject, OnInit, signal } from '@angular/core';
import { Header } from '../../components/header/header';
import { Footer } from "../../components/footer/footer";
import {ReactiveFormsModule} from "@angular/forms";
import{MatButtonToggleModule} from '@angular/material/button-toggle';
import { ActivatedRoute } from '@angular/router';
import { ClientStore } from '../../store/clientVue.store';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { VuePartie } from '../../helper/vue-partie';
import { VilleModel } from '../../models/ville-model';
import { CommonModule } from '@angular/common';
import { SiteModel } from '../../models/site-model';

@Component({
  selector: 'app-aventure',
  imports: [Header, 
    CommonModule,
    Footer, 
    ReactiveFormsModule,
    MatButtonToggleModule,
  MatProgressSpinner],
  templateUrl: './aventure.html',
  styleUrl: './aventure.css',
})
export class Aventure implements OnInit{
  route = inject(ActivatedRoute)
  data_type = signal<string>("");
  imgSelect = signal<any>(0);
  id_aventure = "13FC9EBF-B722-4BB7-C36B-08DE8DA872D3";
  clientVueStore = inject(ClientStore);
  clientVueSelected = signal<VuePartie | null>(null);
  villeSelected = signal<VilleModel | null>(null);
  siteSelected = signal<SiteModel | null>(null);
  VilleOrSite = signal("v");
  images = [
    'test/baobab.jpg',
    'test/isalo.jpg',
    'test/kon.jpg',
    'test/nosybe.jpg'
  ]
  
  changeImage(ref:any){
    this.imgSelect.set(ref);
  }
  async ngOnInit() {
    if(this.clientVueStore.liste_image()?.images.length! > 0){
      this.imgSelect.set(this.clientVueStore.liste_image()?.images[0]);
    }else{
      this.imgSelect.set(0);
    }
    await this.clientVueStore.getAll(this.id_aventure);
    if(this.clientVueStore.liste_vue_partie().length > 0){
      this.clientVueSelected.set(this.clientVueStore.liste_vue_partie()[0]);
    }
    const id = this.route.snapshot.paramMap.get('id');
    console.log('l\'id envoyer est  : ' + id);
  }
  async selectOnePart(value:string){
    
    this.data_type.set(value);
    await this.clientVueStore.selectOnVue(value);
    if(this.clientVueStore.vue_partie()){
      this.clientVueSelected.set(this.clientVueStore.vue_partie());
      // console.log(this.clientVueSelected());
    }
  }
  async selectVille(id: string){
    await this.clientVueStore.methVilleSelect(id);
    if(this.clientVueStore.villeSelect()){
      this.VilleOrSite.set("v");
      this.villeSelected.set(this.clientVueStore.villeSelect());
      await this.clientVueStore.getImages(this.villeSelected()?.id!);
      this.imgSelect.set(this.clientVueStore.liste_image()?.images[0]);
    }
  }
  async rechargeVille(value: string){
    if(value == "v"){
      await this.clientVueStore.getImages(this.villeSelected()?.id!);
      this.imgSelect.set(this.clientVueStore.liste_image()?.images[0]);
      this.VilleOrSite.set("v");
    }
    if(value == "s"){
      await this.clientVueStore.getSite(this.villeSelected()?.id!);
      
      if(this.clientVueStore.siteSelect()){
        this.siteSelected.set(this.clientVueStore.siteSelect());
        await this.clientVueStore.getImages(this.siteSelected()?.id!);
        this.imgSelect.set(this.clientVueStore.liste_image()?.images[0]);
        this.VilleOrSite.set("s")
      }else{
        alert("aucun site n'est trouvé sur cette ville")
      }
    }

  }
}

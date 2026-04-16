import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { MenuStore } from '../../store/check-menu-header';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProduitStore } from '../../store/produit.store';

@Component({
  selector: 'app-header',
  imports: [MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  menuStore = inject(MenuStore);
  router = inject(Router);
  menuActive = signal<string>("");
  rateHover = signal<boolean>(false);
  rateLeave = signal<boolean>(false);
  menuHover = signal<boolean>(false);
  moreAventure = signal<boolean>(false);
  moreClassique = signal<boolean>(false);
  moreRand = signal<boolean>(false);
  produitStore = inject(ProduitStore);
  timer: any;
constructor(){
  effect(() => {
    if(this.rateLeave()){
      this.timer = setTimeout(() =>{
        if(!this.menuHover()){
          this.rateHover.set(false);
          this.rateLeave.set(false);
        }
      },200);
    }
    if(this.menuHover()){
      clearTimeout(this.timer);
    }
  });
}
  async ngOnInit() {
    await this.produitStore.GetAllProd();
    const lastMenu = localStorage.getItem('menu');
    if(lastMenu){
      this.menuActive.set(lastMenu);
    }
    else{
      this.menuActive.set('home')
    }
  }
mouseleaveAndrateLeave(val:boolean){
  this.timer = setTimeout(() => {
    if(!this.moreAventure() && !this.moreClassique() && !this.moreRand()){
      this.rateHover.set(val);
      this.menuHover.set(val);
    }
  }, 200);
  if(this.moreAventure() || this.moreClassique() || this.moreRand()){
    clearTimeout(this.timer);
  }
}

  setMenuMethode(menu:'home'|'rate'|'about'|'contact'){
    
    this.menuStore.setMenu(menu);
    this.menuActive.set(menu);
    switch(menu){
      case 'rate':
        this.router.navigate(['/rate']);
        break;
      case 'contact':
        // this.router.navigate([],{fragment:'contact'});
         document.getElementById('contact')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        break;
      case 'home':
        this.router.navigate(['/']);
        
        break;
      default:
        this.router.navigate(['/']);
    }
  }
  showMenu = signal(false);
  actioShowMenu(){
    this.showMenu.set(!this.showMenu());
  }
  goTo(go:string){
    this.menuStore.setMenu('rate')
    if(go == "Aventure"){
      this.router.navigate(['/aventure']);
    }
    if(go == "Classique"){
      this.router.navigate(['/classique']);
    }
    if(go == "randonnees"){
      this.router.navigate(['/randonnees'])
    }
  }
}

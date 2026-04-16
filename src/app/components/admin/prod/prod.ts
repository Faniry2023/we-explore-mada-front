import { Component, inject, OnInit, signal } from '@angular/core';
import { Header } from '../header/header';
import { AddProd } from '../add-prod/add-prod';
import { MatDialog } from '@angular/material/dialog';
import{MatButtonToggleModule} from '@angular/material/button-toggle';
import { DefSpeVille } from '../def-spe-ville/def-spe-ville';
import { CommonModule, KeyValue } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProduitStore } from '../../../store/produit.store';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { VilleStore } from '../../../store/ville.store';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VilleModel } from '../../../models/ville-model';
import { SiteStore } from '../../../store/site.store';
import { SiteModel } from '../../../models/site-model';
import { VilleEtImages } from '../../../helper/ville-et-images';
import { VilleSeconHelper } from '../../../helper/ville-secon-helper';
import { VuePartie } from '../../../helper/vue-partie';
import { PartieStore } from '../../../store/partie.store';
import { PartieVilleHelper } from '../../../helper/partie-ville-helper';
import { PartieModel } from '../../../models/partie-model';
@Component({
  selector: 'app-prod',
  imports: [Header,
    AddProd,
    MatButtonToggleModule,
    DefSpeVille,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinner,
    ReactiveFormsModule
    ],
  templateUrl: './prod.html',
  styleUrl: './prod.css',
})
export class Prod implements OnInit{
  loadin = signal(true);
  prodSel = signal<string>("");
  prodStore = inject(ProduitStore);
  addPartieProduit = signal<boolean>(false);
  villeStore = inject(VilleStore);
  imagesPreviewVille = signal<string[]>([])
  imagesFilesVille = signal<File[]>([]);
  imagesPreviewSite = signal<string[]>([]);
  imagesFilesSite = signal<File[]>([]);
  listOfProdSel = signal<VuePartie[]>([]);

  fb = inject(FormBuilder);



 //######## PROD ###################
 
  selectProd(id:string){
    this.addPartieProduit.set(false);
    console.log(id);
    this.listOfProdSel.set([])
    this.prodSel.set(id);
    const liste = this.partieStore.liste_vue_partie().filter(p => p.partie.id_produit.toUpperCase() === id.toUpperCase());
    console.log(liste);
    this.listOfProdSel.set(liste);
  }

 //########## FIN PROD ##############

//### P A R T I E #####################################################
isPartieUpdate = signal<boolean>(false);
partieStore = inject(PartieStore);
id_ville_select = signal<string[]>([]);
partie_ville_select = signal<VilleSeconHelper[]>([]);
formGroupePartie = this.fb.group({
  titre: ['',[Validators.required]],
  sous_titre: ['',[Validators.required]],
  description: ['',[Validators.required]],
  nb_jours: [0,[Validators.required]],
})

  saveVilleSelect(model: VilleModel){
    const vsh: VilleSeconHelper = {
      id: model.id,
      nom: model.nom,
    }
    if(!this.id_ville_select().includes(model.id) && !this.partie_ville_select().includes(vsh)){
          this.id_ville_select().push(model.id);
          this.partie_ville_select().push(vsh);
    }
  }
  cancelOneVille(model:VilleSeconHelper){
    
    this.partie_ville_select.set(this.partie_ville_select().filter(v => v.id.toUpperCase() !== model.id.toUpperCase()))
    this.id_ville_select.set(this.id_ville_select().filter(v => v.toUpperCase() !== model.id.toUpperCase()));
    console.log(model.id)
    console.log(this.partie_ville_select());
  }

  async ajoutParti(){
    this.addPartieProduit.set(true)
  }

async savePartie(){
  if(this.formGroupePartie.valid){
    var id_villes = this.id_ville_select().join('/');
    const partieModel: PartieModel = {
      id:this.isPartieUpdate() ? this.partieStore.vue_partie()?.partie.id! : '',
      id_produit: this.prodSel(),
      titre: this.formGroupePartie.value.titre!,
      sous_titre: this.formGroupePartie.value.sous_titre!,
      description: this.formGroupePartie.value.description!,
      nb_jours: this.formGroupePartie.value.nb_jours!,
      villes: id_villes
    }
    const model: PartieVilleHelper = {
      partie:partieModel,
      villes:this.partie_ville_select()
    }
    await this.partieStore.Add(model,this.isPartieUpdate());
    if(!this.partieStore.isError()){
      if(this.isPartieUpdate()){
        this.listOfProdSel.set(this.listOfProdSel().filter(p => p.partie.id.toUpperCase() !== partieModel.id.toUpperCase()));
      }
      this.listOfProdSel().push(this.partieStore.newTemps()!);
      console.log(this.partieStore.newTemps());
      this.formGroupePartie.reset();
      this.partie_ville_select.set([]);
      this.id_ville_select.set([]);
      this.isPartieUpdate.set(false);
    }
  }
  else{
    alert('veilliez remplir tous les champs');
  }
}

  actioncancelParti(){
    this.addPartieProduit.set(false);
    this.isPartieUpdate.set(false);
  }

  async update(id: string){
    this.id_ville_select.set([]);
    this.partie_ville_select.set([]);
    this.isPartieUpdate.set(true);
    await this.partieStore.selectOnVue(id);
    this.id_ville_select.set(this.partieStore.vue_partie()?.partie.villes.split('/')!);
    this.formGroupePartie.get('titre')?.setValue(this.partieStore.vue_partie()?.partie.titre!)
    this.formGroupePartie.get('sous_titre')?.setValue(this.partieStore.vue_partie()?.partie.sous_titre!)
    this.formGroupePartie.get('description')?.setValue(this.partieStore.vue_partie()?.partie.description!)
    this.formGroupePartie.get('nb_jours')?.setValue(this.partieStore.vue_partie()?.partie.nb_jours!)
    this.partieStore.vue_partie()?.villes.forEach(item =>{
      const villeSecond: VilleSeconHelper = {
        id:item.id,
        nom: item.nom
      }
      this.partie_ville_select().push(villeSecond);
    })
    window.scrollTo({
      top:0,
      behavior:'smooth'
    })
  }

  async deletePartie(id:string){
    var ok = confirm('vulez vous vraiment supprimer cette élément?');
    if(ok){
      await this.partieStore.delete(id);
    }
  }
//#######F I N    P A R T I E #########################################












  onFileSelectedVille(event: any) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files).slice(0, 5);

    this.imagesPreviewVille.set([]);
    this.imagesFilesVille.set([]);

    files.forEach(file => {
      if (!file.type.startsWith('image/')) return;

      // 👉 pour affichage
      const url = URL.createObjectURL(file);
      this.imagesPreviewVille().push(url);

      // 👉 pour backend
      this.imagesFilesVille().push(file);
    });
      console.log(this.imagesFilesVille)
    input.value = '';
  }
  data_type = signal<string>('Accueil');
  private dialog = inject(MatDialog)
  async ngOnInit() {
    await this.prodStore.GetAllProd();
    await this.villeStore.getAll();
    await this.partieStore.getAll();
    this.partieStore.liste_vue_partie().forEach(item =>{
      console.log(item.villes)
    })
  }
  openAddProd(){
    this.dialog.open(AddProd,{
      width:'50%',
      height:'20%',
      exitAnimationDuration:'300ms',
      enterAnimationDuration:'400ms'
    })
  }
  openAddDefSpe(){
    this.dialog.open(DefSpeVille,{
      width:'50%',
      height:'20%',
      exitAnimationDuration:'300ms',
      enterAnimationDuration:'400ms'
    })
  }





  //VILLE#####################################################################
  private fb_ville = inject(FormBuilder);
  villeSelected = signal<VilleModel | null>(null);
  isUpdateVille = signal<boolean>(false);
  formGroupVille = this.fb_ville.group({
    nom: ['',[Validators.required]],
    description: ['',[Validators.required]],
    youtube:['',[Validators.required]],
  });


  async actionSelectVille(model: VilleModel){
    this.isUpdateVille.set(false);
    this.villeSelected.set(model);
    await this.villeStore.getSelect(this.villeSelected()?.id!);
    this.imagesPreviewVille.set([]);
    this.imagesFilesVille.set([])
    this.formGroupVille.reset();
    if(this.villeStore.villeEtImage()){
      console.log('ville et image ok')
      this.isUpdateVille.set(true);
      var i = 0;
      this.villeStore.villeEtImage()?.images.forEach(item =>{
        i++;
        this.imagesPreviewVille().push('data:image/png;base64,'+item);
        const base64 = item;
        const mime = this.getMimeType(base64);
        const file = this.base64ToFile(base64,'image_update'+i,mime);
        this.imagesFilesVille().push(file);
      })
      this.formGroupVille.get("nom")?.setValue(this.villeStore.villeEtImage()?.villes.nom!);
      this.formGroupVille.get("description")?.setValue(this.villeStore.villeEtImage()?.villes.description!);
      this.formGroupVille.get("youtube")?.setValue(this.villeStore.villeEtImage()?.villes.lien_youtube!);
    }
  }
  CancelUpdate(){
    this.isUpdateVille.set(false);
    this.villeStore.delAllDef();
    this.imagesPreviewVille.set([]);
    this.formGroupVille.reset();
    this.villeSelected.set(null);
  }

  async saveVille(){
    if(this.formGroupVille.valid){
      let json_des_spe = JSON.stringify(this.villeStore.def_spe_temps());
      const ville:VilleModel ={
        id: this.isUpdateVille() ? this.villeSelected()?.id! : '',
        nom: this.formGroupVille.value.nom!,
        description: this.formGroupVille.value.description!,
        des_spe: json_des_spe,
        lien_youtube: this.formGroupVille.value.youtube!
      }

      await this.villeStore.Add(ville,this.imagesFilesVille(),this.isUpdateVille());
      if(!this.villeStore.isError()){
        this.formGroupVille.reset();
        this.imagesFilesVille.set([]);
        this.imagesPreviewVille.set([]);
      }
    }else{
      alert('vérifier les champs à remplir!');
    }
  }
  afficher(){
    let json = JSON.stringify(this.villeStore.def_spe_temps())
    console.log(this.villeStore.def_spe_temps());
  }
  deleteDefSpe(key:any){
    this.villeStore.delOneDef(key);
  }
  async delete(id_ville: string){

    var isDel = confirm("Voulez vous vraiment supprimer cette élément?");
    if(isDel){
      this.formGroupVille.reset();
      this.formGroupSite.reset();
      this.imagesFilesVille.set([]);
      this.imagesPreviewVille.set([]);
      this.imagesFilesSite.set([]);
      this.imagesPreviewSite.set([]);
      this.isUpdateVille.set(false);
      this.isUpdateSite.set(false);
      await this.villeStore.delete(id_ville);
    }
  }
  //FIN VILLE #########################################################


  //SITE###############################################################
  villeSelectSite = signal<VilleModel | null>(null);
  siteStore = inject(SiteStore);
  isUpdateSite = signal<boolean>(false);

  async actionSelectVilleInSite(model: VilleModel){
    this.isUpdateSite.set(false);
    this.villeSelectSite.set(model)
    await this.siteStore.getSelect(this.villeSelectSite()?.id!)
    this.imagesPreviewSite.set([]);
    this.imagesFilesSite.set([]);
    this.formGroupSite.reset();
    if(this.siteStore.siteEtImage()){
      this.isUpdateSite.set(true);
      var i = 0;
      this.siteStore.siteEtImage()?.images.forEach(item =>{
        i++;
        // this.imagesPreviewSite.push('data:image/png;base64,'+item);
        this.imagesPreviewSite().push('data:image/png;base64,'+item)
        // console.log('data:image/png;base64,'+item)
        const base64 = item;
        const mime = this.getMimeType(base64);
        const file = this.base64ToFile(base64,'image_update'+i,mime);
        this.imagesFilesSite().push(file);
      })
      this.formGroupSite.get("nom")?.setValue(this.siteStore.siteEtImage()?.site.nom!);
      this.formGroupSite.get("description")?.setValue(this.siteStore.siteEtImage()?.site.description!);
      this.formGroupSite.get("youtube")?.setValue(this.siteStore.siteEtImage()?.site.lien_youtube!);
    }
    
  }
  private fb_site = inject(FormBuilder);
  formGroupSite = this.fb_site.group({
    nom: ['',[Validators.required]],
    description: ['',[Validators.required]],
    youtube:['',[Validators.required]],
  })

 onFileSelectedSite(event: any) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files).slice(0, 5);

    this.imagesPreviewSite.set([]);
    this.imagesFilesSite.set([]);

    files.forEach(file => {
      if (!file.type.startsWith('image/')) return;

      // 👉 pour affichage
      const url = URL.createObjectURL(file);
      this.imagesPreviewSite().push(url);

      // 👉 pour backend
      this.imagesFilesSite().push(file);
    });
      console.log(this.imagesFilesSite)
    input.value = '';
  }

  async saveSite(){
    if(this.formGroupSite.valid){
      const siteModel: SiteModel ={
        id: this.isUpdateSite() ? this.siteStore.siteEtImage()?.site.id! : '',
        id_ville: this.villeSelectSite()?.id!,
        nom: this.formGroupSite.value.nom!,
        description: this.formGroupSite.value.description!,
        lien_youtube: this.formGroupSite.value.youtube!
      }
      await this.siteStore.Add(siteModel,this.imagesFilesSite(), this.isUpdateSite());
      if(!this.siteStore.isError()){
        this.formGroupSite.reset();
        this.imagesFilesSite.set([]);
        this.imagesPreviewSite.set([]);
      }
    }else{
      alert("Velliez remlpir tout les champs");
    }
  }
  // F  I  N    S  I  T  E ##########################################################################""


  //IMAGE
  base64ToFile(base64: string, fileName: string, mimeType: string): File {
    const byteString = atob(base64);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }

    return new File([arrayBuffer], fileName, { type: mimeType });
  }
  getMimeType(base64: string): string {
    if (base64.startsWith('/9j/')) return 'image/jpeg';
    if (base64.startsWith('iVBORw0KGgo')) return 'image/png';
    return 'image/png';
  }

  async deleteSite(id_site: string){
    var isDel = confirm("Voulez vous vraiment supprimer cette élément?");
    if(isDel){
      this.formGroupSite.reset();
      this.imagesFilesSite.set([]);
      this.imagesPreviewSite.set([]);
      this.isUpdateSite.set(false);
      await this.siteStore.delete(id_site);
    }
  }
}
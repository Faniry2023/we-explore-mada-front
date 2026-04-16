import { ChangeDetectorRef, Component, HostListener, inject } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [Header,Footer],
  templateUrl: './home.html',
  styleUrl: './home.css',
  animations:[
      trigger('slideIn', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(50px)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateY(0)'
      })),
      transition('hidden => visible', [
        animate('700ms ease-out')
      ])
    ])
  ]
})
export class Home {
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef)
  visibleItems: boolean[] = [];
  images = [
      'test/baobab.jpg',
      'test/isalo.jpg',
      'test/kon.jpg',
      'test/nosybe.jpg'
    ];
  hasScrolled = false;
  @HostListener('window:scroll', [])
  //ancien scroll
  // onScroll() {
  //   const elements = document.querySelectorAll('.titre, #adventure, #Classique, #randonne, #tem');
  //   elements.forEach((el, index) => {
  //     const rect = el.getBoundingClientRect();
  //     if (rect.top < window.innerHeight - 20) {
  //       this.visibleItems[index] = true;
  //     }
  //   });
  // }

  //nouvea scroll
  onScroll() {
  this.hasScrolled = true;

  const elements = document.querySelectorAll('.titre, #adventure, #Classique, #randonne, #tem');

  elements.forEach((el, index) => {
    const rect = el.getBoundingClientRect();

    if (this.hasScrolled && rect.top < window.innerHeight - 100) {
      this.visibleItems[index] = true;
    }
  });
}
  currentIndex = 0;
  autoSlideInterval: any;

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    clearInterval(this.autoSlideInterval);
  }

  /** Calcule la position actuelle du slider */
  getTransform() {
    return `translateX(-${this.currentIndex * 100}%)`;
  }
  getTransformTem() {
    return `translateX(-${this.currentIndex * 100}%)`;
  }

  /** Passe à l'image suivante */
  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.restartAutoSlide();
  }

  /** Passe à l'image précédente */
  prevSlide() {
    this.currentIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.restartAutoSlide();
  }

  /** Démarre le défilement automatique */
  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
      this.cdr.detectChanges();
    }, 4000); // 4 secondes
  }

  /** Redémarre le timer après une interaction manuelle */
  restartAutoSlide() {
    clearInterval(this.autoSlideInterval);
    this.startAutoSlide();
  }
  goToAvanture(){
    this.router.navigate(["/aventure"]);
  }
  goToClassique(){
    this.router.navigate(["/classique"])
  }
}

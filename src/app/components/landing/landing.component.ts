import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ScriptChargeService } from 'src/app/services/script-charge.service';
import Swiper from 'swiper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['../../../assets/css/swiper-bundle.min.css', '../../../assets/css/styles.css']
})
export class LandingComponent implements OnInit/*, AfterViewInit*/ {
  cssUrl4: string = '/assets/css/styles.css';
  cssUrl5: string = '/assets/css/swiper-bundle.min.css';

  constructor(
    private _chargeScripts: ScriptChargeService,
    public sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private router: Router
  ) { }

  ngOnInit(): void {


    // Cargar archivos CSS al inicio
    this.loadJsFiles();
  }

  ngAfterViewInit(): void {
    if (this.router.url === '/home') {
      try {
        new Swiper(".new-swiper", {
          spaceBetween: 24,
          loop: true,
          slidesPerView: "auto",
          centeredSlides: true,

          pagination: {
            el: ".swiper-pagination",
            dynamicBullets: true,
          },
          breakpoints: {
            992: {
              spaceBetween: 80,
            },
          },
        });
        console.log('Swiper Initialized successfully');
      } catch (error) {
        console.error('Error initializing Swiper:', error);
      }
    }

    // Verificar la carga de archivos CSS después de la vista
    this.checkCssFiles();
  }

  private loadJsFiles(): void {
    // Cargar archivos CSS utilizando el servicio ScriptCharge
    this._chargeScripts.charge(["main/main"]);
    this._chargeScripts.charge(["scrollreveal.min/scrollreveal.min"]);
  }

  private checkCssFiles(): void {
    // Verificar la carga de archivos CSS
    this.isCssFileLoaded(this.cssUrl4);
    this.isCssFileLoaded(this.cssUrl5);
  }

  private isCssFileLoaded(url: string): void {
    // Verificar si el archivo CSS está cargado correctamente
    const linkElement = this.renderer.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.type = 'text/css';
    linkElement.href = url;

    linkElement.onload = () => {
      console.log(`Archivo CSS cargado correctamente: ${url}`);
    };

    linkElement.onerror = () => {
      console.error(`Error al cargar el archivo CSS: ${url}`);
    };

    this.renderer.appendChild(document.head, linkElement);
  }
}

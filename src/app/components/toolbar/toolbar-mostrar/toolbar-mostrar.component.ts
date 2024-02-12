import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-toolbar-mostrar',
  templateUrl: './toolbar-mostrar.component.html',
  styleUrls: ['./toolbar-mostrar.component.css']
})
export class ToolbarMostrarComponent {
  cssUrl4: string = '/assets/css/styles.css';
  cssUrl5: string = '/assets/css/swiper-bundle.min.css';

  constructor(
    /*private _chargeScripts: ScriptChargeService,*/
    public sanitizer: DomSanitizer/*,
    private renderer: Renderer2,
    private router: Router*/
  ) { }
}

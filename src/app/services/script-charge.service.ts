import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScriptChargeService {
  private renderer: Renderer2;

  constructor(private rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  charge(files: string[]): void {
    for (const file of files) {
      const script = this.renderer.createElement('script');
      this.renderer.setProperty(script, 'src', `./assets/js/${file}.js`);

      // Handling script load success
      script.onload = () => {
        console.log(`${file}.js loaded successfully.`);
      };

      // Handling script load error
      script.onerror = () => {
        console.error(`Failed to load ${file}.js.`);
      };

      this.renderer.appendChild(document.body, script);
    }
  }
}

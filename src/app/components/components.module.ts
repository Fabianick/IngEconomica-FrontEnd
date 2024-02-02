import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsRoutingModule } from './components-routing.module';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ToolbarMostrarComponent } from './toolbar/toolbar-mostrar/toolbar-mostrar.component';
import { LoginComponent } from './login/login.component';
import { LoginMostrarComponent } from './login/login-mostrar/login-mostrar.component';
import { IndexaComponent } from './indexa/indexa.component';
import { IndexMostrarComponent } from './indexa/index-mostrar/index-mostrar.component';
import { FooterComponent } from './footer/footer.component';
import { FooterMostrarComponent } from './footer/footer-mostrar/footer-mostrar.component';


@NgModule({
  declarations: [
    ToolbarComponent,
    ToolbarMostrarComponent,
    LoginComponent,
    LoginMostrarComponent,
    IndexaComponent,
    IndexMostrarComponent,
    FooterComponent,
    FooterMostrarComponent,
  ],
  imports: [
    CommonModule,
    ComponentsRoutingModule
  ]
})
export class ComponentsModule { }

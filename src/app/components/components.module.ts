import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsRoutingModule } from './components-routing.module';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ToolbarMostrarComponent } from './toolbar/toolbar-mostrar/toolbar-mostrar.component';
import { IndexaComponent } from './indexa/indexa.component';
import { LandingComponent } from './landing/landing.component';
import { IndexMostrarComponent } from './indexa/index-mostrar/index-mostrar.component';
import { FooterComponent } from './footer/footer.component';
import { FooterMostrarComponent } from './footer/footer-mostrar/footer-mostrar.component';
import {MatButtonModule} from '@angular/material/button';
import { OperationComponent } from './operation/operation.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDialogModule} from '@angular/material/dialog';

import { LoginComponent } from './login/login.component';
import { LoginMostrarComponent } from './login/login-mostrar/login-mostrar.component';
import { RegisterComponent } from './register/register.component';
import { RegisterMostrarComponent } from './register/register-mostrar/register-mostrar.component';
import { DialogComponent } from './operation/dialog/dialog.component';

@NgModule({
  declarations: [
    LoginComponent,
    LoginMostrarComponent,
    RegisterComponent,
    RegisterMostrarComponent,
    ToolbarComponent,
    ToolbarMostrarComponent,
   // IndexaComponent,
    LandingComponent,
    IndexMostrarComponent,
    FooterComponent,
    FooterMostrarComponent,
    OperationComponent,
    DialogComponent,

  ],
  imports: [
    CommonModule,
    ComponentsRoutingModule,
    MatTableModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDialogModule,
  ]
})
export class ComponentsModule { }

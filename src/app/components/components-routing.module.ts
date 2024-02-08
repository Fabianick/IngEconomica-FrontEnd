import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { OperationComponent } from './operation/operation.component';
import { GuardService } from '../services/guard.service';

const routes: Routes = [  
  {
    path: 'footer',
    component: FooterComponent
  },
  {
    path: 'toolbar',
    component: ToolbarComponent
  },
  {
    path: 'operation',
    component: OperationComponent,
    canActivate: [GuardService],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentsRoutingModule { }

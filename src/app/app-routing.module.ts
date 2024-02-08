import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexaComponent } from './components/indexa/indexa.component';
import { LoginComponent } from './components/login/login.component';
import { GuardService } from './services/guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: IndexaComponent,
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'components',
    loadChildren: () =>
      import('./components/components.module').then((m) => m.ComponentsModule),
      canActivate: [GuardService],

  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

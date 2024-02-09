import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexaComponent } from './components/indexa/indexa.component';
import { LandingComponent } from './components/landing/landing.component';

const routes: Routes = [
 // { path: 'home', component: LandingComponent },
 // { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: LandingComponent,
  },
  {
    path: 'components',
    loadChildren: () =>
      import('./components/components.module').then((m) => m.ComponentsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

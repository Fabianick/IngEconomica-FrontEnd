import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuardService {
  constructor(private lService:LoginService, private router:Router) { }
  canActivate(route: ActivatedRouteSnapshot) {
    const requiredRole = route.data['requiredRole'];
    const rpta=this.lService.verificar();
    if(!rpta){
      this.router.navigate(['/login']);
      return false;
    }
    if (requiredRole && this.lService.showRole() !== requiredRole) {
      this.router.navigate(['/components']);
      return false;
    }

    return rpta;
  }
}

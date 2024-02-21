import { Component } from '@angular/core';
import { LoginService } from './services/login.service';
import { UsersService } from 'src/app/services/users.service';
import { OperationService } from './services/operation.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  role: string = '';
  title = 'IngEconomica-Frontend';
  constructor(private loginService: LoginService,private uS: UsersService,private op:OperationService) {}
  username: string = "";


  cerrar() {
    sessionStorage.clear();
  }
  verificar() {
    this.role = this.loginService.showRole();
    return this.loginService.verificar() && this.mostrarmenu();
  }

  validarRol() {
    if (this.role == 'ADMIN' || this.role == 'USER') {
      return true;
    } else {
      return false;
    }
  }
  mostrarmenu() {
    return window.location.pathname.startsWith('/components');
  }

  cambioDolar()
  {
    this.username = String(sessionStorage.getItem("username"));

    this.uS.update(this.username).subscribe();
    console.log('cambia');
  }
}

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
  DescargarPDF(){
    const pdfUrl = 'assets/pdf/Manual-Del-Usuario (1).pdf';

    // Crea un elemento 'a' para el enlace de descarga
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'WalterDelgadoCV.pdf'; // Nombre que tendrá el archivo descargado

    // Simula un clic en el enlace para iniciar la descarga
    link.click();
  }
}

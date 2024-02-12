import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from 'src/app/services/users.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatRow } from '@angular/material/table';
import { MatColumnDef } from '@angular/material/table';
import { ToolbarComponent } from '../../toolbar/toolbar.component';

@Component({
  selector: 'app-register-mostrar',
  templateUrl: './register-mostrar.component.html',
  styleUrls: ['./register-mostrar.component.css']
})
export class RegisterMostrarComponent  implements OnInit{


  constructor(private userService: UsersService, private router: Router, private snackBar: MatSnackBar,private formBuilder: FormBuilder){}
    username: string = ""
    password: string = ""
    nombre: string = ""
    apellidoPaterno: string = ""
    apellidoMaterno: string = ""
    email: string = "" //Creo que debería de añadirse para recuperar la contraseña... No es necesario obviamente, solo un añadido por sea caso.
    ngOnInit(): void {
    }
    register() {
      
     }

}

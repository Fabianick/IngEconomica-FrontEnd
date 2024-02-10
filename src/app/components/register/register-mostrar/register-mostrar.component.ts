import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from 'src/app/services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Users } from 'src/app/models/users';
import * as CryptoJs from 'crypto-js';
import { Express } from 'express';
import * as bcrypt from 'bcryptjs';
@Component({
  selector: 'app-register-mostrar',
  templateUrl: './register-mostrar.component.html',
  styleUrls: ['./register-mostrar.component.css']
})
export class RegisterMostrarComponent  implements OnInit{

  claveEncriptada:string='';

  constructor(private uS: UsersService, private router: Router, private snackBar: MatSnackBar,private formBuilder: FormBuilder){}
    mensaje: string = ""
    usuario: Users = new Users();

    form: FormGroup = new FormGroup({});
    ngOnInit(): void {
      this.form = this.formBuilder.group({
        id: [''],
        username: ['', Validators.required],
        password: ['', Validators.required],
        enabled: [''],
        nombres: ['', Validators.required],
        apellidop: [''],
        apellidom: [''],
      });
    }
     encrypt(){
      if(this.form.valid){
        const prueba2= bcrypt.hashSync(this.form.value.password, 4);

        this.claveEncriptada=prueba2.toString();
        console.log(this.claveEncriptada);

      }
    }
    register() {
      this.encrypt();
      if (this.form.valid) {
        this.usuario.id = this.form.value.id;
        this.usuario.username = this.form.value.username;
        this.usuario.password = this.claveEncriptada;
        this.usuario.enabled =  true;
        this.usuario.nombres = this.form.value.nombres;
        const apellP = this.form.value.apellidop;
        const apellM = this.form.value.apellidom;
        const apellidos = `${apellP} ${apellM}`;
        this.usuario.apellidos = apellidos;

        console.log(this.claveEncriptada);

          this.uS.insert(this.usuario).subscribe((data) => {
            this.uS.list().subscribe((data) => {
              this.uS.setList(data);
            });
          });
        this.router.navigate(['/login']);
      } else {
        this.mensaje = 'Por favor complete todos los campos obligatorios.';
        this.snackBar.open(this.mensaje, "Aviso",{duration:2000});

      }
     }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from 'src/app/services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Users } from 'src/app/models/users';

@Component({
  selector: 'app-register-mostrar',
  templateUrl: './register-mostrar.component.html',
  styleUrls: ['./register-mostrar.component.css']
})
export class RegisterMostrarComponent  implements OnInit{


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
    register() {
      if (this.form.valid) {
        this.usuario.id = this.form.value.id;
        this.usuario.username = this.form.value.username;
        this.usuario.password = this.form.value.password;
        this.usuario.enabled =  true;
        this.usuario.nombres = this.form.value.nombres;
        const apellP = this.form.value.apellidop;
        const apellM = this.form.value.apellidom;
        const apellidos = `${apellP} ${apellM}`;
        this.usuario.apellidos = apellidos;
  
  
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

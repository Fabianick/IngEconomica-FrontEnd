import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as moment from 'moment';
import { Operation } from 'src/app/models/operation';
import { Users } from 'src/app/models/users';
import { LoginService } from 'src/app/services/login.service';
import { OperationService } from 'src/app/services/operation.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.css']
})
export class OperationComponent implements OnInit {

  username:string="";
  formIngreso: FormGroup = new FormGroup({});
  formRetiro: FormGroup = new FormGroup({});
  formLibre: FormGroup = new FormGroup({});
  demo1TabIndex : number = 0;
  operation: Operation = new Operation();
  mensaje: string = '';
  listausuarios: Users[] = [];
  edicion: boolean = false;
  id:number=0;
  codeid: number=0;
  idguard:number=0;

  tipoperiodo: { value: number; viewValue: string }[] = [
    { value: 0, viewValue: 'None' },
    { value: 1, viewValue: 'Quincenal' },
    { value: 2, viewValue: 'Bimestral' },
    { value: 3, viewValue: 'Trimestral' },
    { value: 4, viewValue: 'Semestral' },
    { value: 5, viewValue: 'Personalizado' },
  ];

  tipotasa: { value: string; viewValue: string }[] = [
    { value: 'Tasa Efectiva', viewValue: 'Tasa Efectiva' },
    { value: 'Tasa Nominal', viewValue: 'Tasa Nominal' },
    { value: 'Tasa Descontada', viewValue: 'Tasa Descontada' }
  ];

  username:string;

  datasource: MatTableDataSource<Operation> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'id',
    'tipo_deposito',
    'monto',
    'tipo_tasa',
    'tipo_periodo',
    'periodo',
    'porcentaje_tasa',
    'capitalizacion',
    'fecha_operacion',
    'users',
    'accion01',
  ];
  constructor(private oS:OperationService,private snackBar: MatSnackBar,private formBuilder: FormBuilder,
    private uS: UsersService,private router: Router,private lS: LoginService, private route: ActivatedRoute){}
  ngOnInit(): void {
    this.codeid=0;

    this.edicion=false;
    this.username= String(sessionStorage.getItem("username"));

    this.oS.listbyUsername(this.username).subscribe((data) => {
      this.datasource = new MatTableDataSource(data);
      this.datasource.paginator = this.paginator;
    });
    this.oS.getList().subscribe((data) => {//actualiza la lista si es actualizada o eliminada
      this.datasource = new MatTableDataSource(data);
      this.datasource.paginator = this.paginator;
    });

    this.uS.list().subscribe((data) => {
      const user = data.find(user => user.username === this.username);
      if (user) {
        this.idguard = user.id;
      }
    });

    this.formIngreso = this.formBuilder.group({
      id: [''],
      tipo_deposito: [''],
      monto: [''],
      tipo_tasa: [''],
      tipo_periodo: [''],
      periodo: [''],
      porcentaje_tasa: [''],
      capitalizacion: [''],
      fecha_operacion: ['']
    });

    this.formRetiro = this.formBuilder.group({
      id: [''],
      tipo_deposito: [''],
      monto: [''],
      tipo_tasa: [''],
      tipo_periodo: [''],
      periodo: [''],
      porcentaje_tasa: [''],
      capitalizacion: [''],
      fecha_operacion: ['']
    });

    this.formLibre = this.formBuilder.group({
      id: [''],
      tipo_deposito: [''],
      monto: [''],
      tipo_tasa: [''],
      tipo_periodo: [''],
      periodo: [''],
      porcentaje_tasa: [''],
      capitalizacion: [''],
      fecha_operacion: ['']
    });


  }

  onKeyPress(event: KeyboardEvent) {
    const keyCode = event.which || event.keyCode;
    const currentValue: string = (event.target as HTMLInputElement).value;
    if (
      (keyCode < 48 || keyCode > 57) && // no es un número
      (keyCode !== 46 || currentValue.includes('.'))
    ) {
      event.preventDefault();
    }
  }

  eliminar(id: number) {
    this.oS.delete(id).subscribe((data) => {
    this.oS.listbyUsername(this.username).subscribe((data) => {
    this.oS.setList(data);
    });
    });
    }


    aceptar(): void {
      if (this.demo1TabIndex==0 &&this.formIngreso.valid) {
        this.operation.id = this.formIngreso.value.id;
        this.operation.tipo_periodo = this.formIngreso.value.tipo_periodo;
        this.operation.monto = this.formIngreso.value.monto;
        this.operation.tipo_tasa = this.formIngreso.value.tipo_tasa;
        this.operation.periodo = this.formIngreso.value.periodo;
        this.operation.porcentaje_tasa = this.formIngreso.value.porcentaje_tasa;
        this.operation.capitalizacion = this.formIngreso.value.capitalizacion;
        this.operation.fecha_operacion = this.formIngreso.value.fecha_operacion;
        this.operation.tipo_deposito='Ingreso';
        this.operation.users.id = this.idguard;

        if (this.edicion) {
          this.oS.update(this.operation).subscribe(() => {
            this.ngOnInit();
          });
        } else {
           this.oS.insert(this.operation).subscribe(() => {
          this.oS.listbyUsername(this.username).subscribe((data) => {
            this.oS.setList(data);
            });
          });
        }
      }
      else if (this.demo1TabIndex==1 &&this.formRetiro.valid) {
        this.operation.id = this.formRetiro.value.id;
        this.operation.tipo_periodo = this.formRetiro.value.tipo_periodo;
        this.operation.monto = this.formRetiro.value.monto;
        this.operation.tipo_tasa = this.formRetiro.value.tipo_tasa;
        this.operation.periodo = this.formRetiro.value.periodo;
        this.operation.porcentaje_tasa = this.formRetiro.value.porcentaje_tasa;
        this.operation.capitalizacion = this.formRetiro.value.capitalizacion;
        this.operation.fecha_operacion = this.formRetiro.value.fecha_operacion;
        this.operation.tipo_deposito='Retiro';
        this.operation.users.id = this.idguard;
        if (this.edicion) {
          this.oS.update(this.operation).subscribe(() => {
            this.ngOnInit();
          });
        } else {
           this.oS.insert(this.operation).subscribe(() => {
          this.oS.listbyUsername(this.username).subscribe((data) => {
            this.oS.setList(data);
            });
          });
        }
      }
      else if (this.demo1TabIndex==2 && this.formLibre.valid) {
        this.operation.id = this.formLibre.value.id;
        this.operation.tipo_periodo = this.formLibre.value.tipo_periodo;
        this.operation.monto = this.formLibre.value.monto;
        this.operation.tipo_tasa = this.formLibre.value.tipo_tasa;
        this.operation.periodo = this.formLibre.value.periodo;
        this.operation.porcentaje_tasa = this.formLibre.value.porcentaje_tasa;
        this.operation.capitalizacion = this.formLibre.value.capitalizacion;
        this.operation.fecha_operacion = this.formLibre.value.fecha_operacion;
        this.operation.tipo_deposito='Libre';
        this.operation.users.id = this.idguard;
        if (this.edicion) {
          this.oS.update(this.operation).subscribe(() => {
            this.ngOnInit();
          });
        } else {
           this.oS.insert(this.operation).subscribe(() => {
          this.oS.listbyUsername(this.username).subscribe((data) => {
            this.oS.setList(data);
            });
          });
        }
      }
       else {
        this.mensaje = 'Completo los campos!!';
        this.snackBar.open(this.mensaje, "Aviso",{duration:2000});

      }
    }

    init(id: number) {
        this.oS.listId(id).subscribe((data) => {
          let fechaFormateada = moment(data.fecha_operacion).toDate();
          if(data.tipo_deposito==='Ingreso'){
            this.formIngreso = new FormGroup({
              id: new FormControl(data.id),
              tipo_deposito: new FormControl(data.tipo_deposito),
              monto: new FormControl(data.monto),
              tipo_tasa: new FormControl(data.tipo_tasa),
              tipo_periodo: new FormControl(data.tipo_periodo),
              periodo: new FormControl(data.periodo),
              porcentaje_tasa: new FormControl(data.porcentaje_tasa),
              capitalizacion: new FormControl(data.capitalizacion),
              fecha_operacion: new FormControl(fechaFormateada)
            });
            this.demo1TabIndex = 0;
            this.codeid=id;
          }
          else if(data.tipo_deposito==='Retiro'){
            this.formRetiro = new FormGroup({
              id: new FormControl(data.id),
              tipo_deposito: new FormControl(data.tipo_deposito),
              monto: new FormControl(data.monto),
              tipo_tasa: new FormControl(data.tipo_tasa),
              tipo_periodo: new FormControl(data.tipo_periodo),
              periodo: new FormControl(data.periodo),
              porcentaje_tasa: new FormControl(data.porcentaje_tasa),
              capitalizacion: new FormControl(data.capitalizacion),
              fecha_operacion: new FormControl(fechaFormateada)
            });
            this.demo1TabIndex = 1;
            this.codeid=id;
          }
          else if(data.tipo_deposito==='Libre'){
            this.formLibre = new FormGroup({
              id: new FormControl(data.id),
              tipo_deposito: new FormControl(data.tipo_deposito),
              monto: new FormControl(data.monto),
              tipo_tasa: new FormControl(data.tipo_tasa),
              tipo_periodo: new FormControl(data.tipo_periodo),
              periodo: new FormControl(data.periodo),
              porcentaje_tasa: new FormControl(data.porcentaje_tasa),
              capitalizacion: new FormControl(data.capitalizacion),
              fecha_operacion: new FormControl(fechaFormateada)
            });
            this.demo1TabIndex = 2;
            this.codeid=id;
          }

          this.edicion=true;

        });

    }


}

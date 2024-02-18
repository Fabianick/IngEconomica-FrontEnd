import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as moment from 'moment';
import { Operation } from 'src/app/models/operation';;
import { Users } from 'src/app/models/users';
import { LoginService } from 'src/app/services/login.service';
import { OperationService } from 'src/app/services/operation.service';
import { UsersService } from 'src/app/services/users.service';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.css']
})
export class OperationComponent implements OnInit {


  username: string = "";
  resultado: string = "";
  formIngreso: FormGroup = new FormGroup({});
  formRetiro: FormGroup = new FormGroup({});
  formLibre: FormGroup = new FormGroup({});
  demo1TabIndex: number = 0;
  operation: Operation = new Operation();
  mensaje: string = '';
  listausuarios: Users[] = [];
  edicion: boolean = false;
  id: number = 0;
  codeid: number = 0;
  idguard: number = 0;
  idconfirm: number = 0;

  tipoperiodo: { value: number; viewValue: string }[] = [
    { value: 0, viewValue: 'None' },
    { value: 15, viewValue: 'Quincenal' },
    { value: 60, viewValue: 'Bimestral' },
    { value: 90, viewValue: 'Trimestral' },
    { value: 120, viewValue: 'Cuatrimestral' },
    { value: 180, viewValue: 'Semestral' },
    { value: 5, viewValue: 'Personalizado' },
  ];

  tipocapitalizacion: { value: number; viewValue: string }[] = [
    { value: 1, viewValue: 'None' },
    { value: 15, viewValue: 'Quincenal' },
    { value: 60, viewValue: 'Bimestral' },
    { value: 90, viewValue: 'Trimestral' },
    { value: 120, viewValue: 'Cuatrimestral' },
    { value: 180, viewValue: 'Semestral' },
    { value: 5, viewValue: 'Personalizado' },
  ];

  tipotasa: { value: string; viewValue: string }[] = [
    { value: 'Tasa Efectiva', viewValue: 'Tasa Efectiva' },
    { value: 'Tasa Nominal', viewValue: 'Tasa Nominal' },
    { value: 'Tasa Descontada', viewValue: 'Tasa Descontada' }
  ];


  datasource: MatTableDataSource<Operation> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'idx',
    'tipo_deposito',
    'monto',
    'tipo_tasa',
    'periodo',
    'porcentaje_tasa',
    'capitalizacion',
    'fecha_operacion',
    'users',
    'accion01',
  ];
  constructor(private oS: OperationService, private snackBar: MatSnackBar, private formBuilder: FormBuilder,
    private uS: UsersService, private router: Router, private lS: LoginService, private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }
  ngOnInit(): void {
    this.codeid = 0;

    this.edicion = false;
    this.username = String(sessionStorage.getItem("username"));

    this.oS.listbyUsername(this.username).subscribe((data) => {
      this.datasource = new MatTableDataSource(data);
      this.datasource.paginator = this.paginator;
    });
    this.oS.getList().subscribe((data) => {
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
      capitalizacion: [1],
      fecha_operacion: [''],
      diasPersonalizados: [''],
      capitalizacionersonalizada: [''],
    });

    this.formRetiro = this.formBuilder.group({
      id: [''],
      tipo_deposito: [''],
      monto: [''],
      tipo_tasa: [''],
      tipo_periodo: [''],
      periodo: [''],
      porcentaje_tasa: [''],
      capitalizacion: [1],
      fecha_operacion: [''],
      diasPersonalizados: [''],
      capitalizacionersonalizada: [''],
    });

    this.formLibre = this.formBuilder.group({
      id: [''],
      tipo_deposito: [''],
      monto: [0],
      tipo_tasa: [''],
      tipo_periodo: [''],
      periodo: [''],
      porcentaje_tasa: [''],
      capitalizacion: [1],
      fecha_operacion: [''],
      diasPersonalizados: [''],
      capitalizacionersonalizada: [''],
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

  confirm(id: number) {
    const dialogRef = this.dialog.open(DialogComponent);
    dialogRef.componentInstance.aceptar.subscribe(() => {
      this.eliminar(id);
    });
  }


  aceptar(): void {
    if (this.demo1TabIndex == 0 && this.formIngreso.valid) {
      this.operation.id = this.formIngreso.value.id;
      this.operation.tipo_periodo = this.formIngreso.value.tipo_periodo;
      this.operation.monto = this.formIngreso.value.monto;
      this.operation.tipo_tasa = this.formIngreso.value.tipo_tasa;
      this.operation.porcentaje_tasa = this.formIngreso.value.porcentaje_tasa;
      this.operation.fecha_operacion = this.formIngreso.value.fecha_operacion;
      this.operation.tipo_deposito = 'Ingreso';
      this.operation.users.id = this.idguard;
      if (this.formIngreso.value.periodo === 5) {
        this.operation.periodo = this.formIngreso.value.diasPersonalizados;
      } else {
        this.operation.periodo = this.formIngreso.value.periodo;
      }
      if (this.formIngreso.value.capitalizacion === 5) {
        this.operation.capitalizacion = this.formIngreso.value.capitalizacionersonalizada;
      } else {
        this.operation.capitalizacion = this.formIngreso.value.capitalizacion;
      }

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
    else if (this.demo1TabIndex == 1 && this.formRetiro.valid) {
      this.operation.id = this.formRetiro.value.id;
      this.operation.tipo_periodo = this.formRetiro.value.tipo_periodo;
      this.operation.monto = this.formRetiro.value.monto;
      this.operation.tipo_tasa = this.formRetiro.value.tipo_tasa;
      this.operation.porcentaje_tasa = this.formRetiro.value.porcentaje_tasa;
      this.operation.fecha_operacion = this.formRetiro.value.fecha_operacion;
      this.operation.tipo_deposito = 'Retiro';
      this.operation.users.id = this.idguard;
      if (this.formRetiro.value.periodo === 5) {
        this.operation.periodo = this.formRetiro.value.diasPersonalizados;
      } else {
        this.operation.periodo = this.formRetiro.value.periodo;
      }
      if (this.formRetiro.value.capitalizacion === 5) {
        this.operation.capitalizacion = this.formRetiro.value.capitalizacionersonalizada;
      } else {
        this.operation.capitalizacion = this.formRetiro.value.capitalizacion;
      }


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
    else if (this.demo1TabIndex == 2 && this.formLibre.valid) {
      this.operation.id = this.formLibre.value.id;
      this.operation.tipo_periodo = this.formLibre.value.tipo_periodo;
      this.operation.monto = this.formLibre.value.monto;
      this.operation.tipo_tasa = this.formLibre.value.tipo_tasa;
      this.operation.porcentaje_tasa = this.formLibre.value.porcentaje_tasa;
      this.operation.fecha_operacion = this.formLibre.value.fecha_operacion;
      this.operation.tipo_deposito = 'Libre';
      this.operation.users.id = this.idguard;
      if (this.formLibre.value.periodo === 5) {
        this.operation.periodo = this.formLibre.value.diasPersonalizados;
      } else {
        this.operation.periodo = this.formLibre.value.periodo;
      }
      if (this.formLibre.value.capitalizacion === 5) {
        this.operation.capitalizacion = this.formLibre.value.capitalizacionersonalizada;
      } else {
        this.operation.capitalizacion = this.formLibre.value.capitalizacion;
      }

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
      this.snackBar.open(this.mensaje, "Aviso", { duration: 2000 });

    }
  }

  init(id: number) {
    this.oS.listId(id).subscribe((data) => {
      let fechaFormateada = moment(data.fecha_operacion).toDate();
      let periodoValue = data.periodo;
      if (!this.tipoperiodo.some(p => p.value === data.periodo)) {
        periodoValue = 5;
      }
      let capitalizacionValue = data.capitalizacion;
      if (!this.tipocapitalizacion.some(p => p.value === data.capitalizacion)) {
        capitalizacionValue = 5;
      }
      if (data.tipo_deposito === 'Ingreso') {
        this.formIngreso = new FormGroup({
          id: new FormControl(data.id),
          tipo_deposito: new FormControl(data.tipo_deposito),
          monto: new FormControl(data.monto),
          tipo_tasa: new FormControl(data.tipo_tasa),
          tipo_periodo: new FormControl(data.tipo_periodo),
          periodo: new FormControl(periodoValue),
          porcentaje_tasa: new FormControl(data.porcentaje_tasa),
          capitalizacion: new FormControl(capitalizacionValue),
          fecha_operacion: new FormControl(fechaFormateada),
          diasPersonalizados: new FormControl(data.periodo),
          capitalizacionersonalizada: new FormControl(data.capitalizacion),
        });
        this.demo1TabIndex = 0;
        this.codeid = id;
      }
      else if (data.tipo_deposito === 'Retiro') {
        this.formRetiro = new FormGroup({
          id: new FormControl(data.id),
          tipo_deposito: new FormControl(data.tipo_deposito),
          monto: new FormControl(data.monto),
          tipo_tasa: new FormControl(data.tipo_tasa),
          tipo_periodo: new FormControl(data.tipo_periodo),
          periodo: new FormControl(periodoValue),
          porcentaje_tasa: new FormControl(data.porcentaje_tasa),
          capitalizacion: new FormControl(capitalizacionValue),
          fecha_operacion: new FormControl(fechaFormateada),
          diasPersonalizados: new FormControl(data.periodo),
          capitalizacionersonalizada: new FormControl(data.capitalizacion),
        });
        this.demo1TabIndex = 1;
        this.codeid = id;
      }
      else if (data.tipo_deposito === 'Libre') {
        this.formLibre = new FormGroup({
          id: new FormControl(data.id),
          tipo_deposito: new FormControl(data.tipo_deposito),
          monto: new FormControl(data.monto),
          tipo_tasa: new FormControl(data.tipo_tasa),
          tipo_periodo: new FormControl(data.tipo_periodo),
          periodo: new FormControl(periodoValue),
          porcentaje_tasa: new FormControl(data.porcentaje_tasa),
          capitalizacion: new FormControl(capitalizacionValue),
          fecha_operacion: new FormControl(fechaFormateada),
          diasPersonalizados: new FormControl(data.periodo),
          capitalizacionersonalizada: new FormControl(data.capitalizacion),
        });
        this.demo1TabIndex = 2;
        this.codeid = id;
      }

      this.edicion = true;

    });

  }

  nominalStock(C: number, S: number, P: number, T: number, cap: number, t: number, d: String) {
    let n = t / cap;
    let m = P / cap;
    let _S = (S * (Math.pow((1 + (T / m)), n)))
    if (d === "Ingreso") {
      _S += C
    }
    else if (d === "Retiro") {
      _S -= C
    }
    return _S;
  }
  efectiveStock(C: number, S: number, P: number, T: number, t: number, d: String) {
    let _S = (S * (Math.pow((1 + T), t / P)))
    if (d === "Ingreso") {
      _S += C
    }
    else if (d === "Retiro") {
      _S -= C
    }
    return _S;
  }
  discountedStock(C: number, S: number, P: number, T: number, t: number, d: String) {
    let _T = T / (1 - T);
    return this.efectiveStock(C, S, P, _T, t, d);
  }
  gettingAllOperations() {
    let operations = this.datasource.data;
    return this.calculateStock(0, operations.length, 0, operations);
  }
  dayDiferenceCalculator(date1: Date, date2: Date) {
    let tD = Math.abs(new Date(date2).getTime() - new Date(date1).getTime());
    let dD = tD / (1000 * 60 * 60 * 24);
    return dD;
  }
  calculateStock(i: number, size: number, stock: number, operations: Operation[]) {//}: number{
    if (i == 0) {
      stock = operations[i].monto;
    }
    else {
      let op_actual = operations[i];
      let op_anterior = operations[i - 1];
      let tiempo = this.dayDiferenceCalculator(op_actual.fecha_operacion, op_anterior.fecha_operacion)
      switch (op_actual.tipo_tasa) {
        case 'Tasa Nominal':
          stock = this.nominalStock(
            op_actual.monto, stock, op_actual.periodo, op_actual.porcentaje_tasa / 100, op_actual.capitalizacion, tiempo, op_actual.tipo_deposito
          )
          break;
        case 'Tasa Efectiva':
          stock = this.efectiveStock(
            op_actual.monto, stock, op_actual.periodo, op_actual.porcentaje_tasa / 100, tiempo, op_actual.tipo_deposito
          )
          break;
        case 'Tasa Descontada':
          stock = this.discountedStock(
            op_actual.monto, stock, op_actual.periodo, op_actual.porcentaje_tasa / 100, tiempo, op_actual.tipo_deposito
          )
          break;
        default:
          break;
      }
    }
    i++;
    console.log(stock);
    if (i >= size) {
      this.resultado = "El monto total acumulado hasta el dia de hoy "+operations[i-1].fecha_operacion+" es de "+parseFloat(stock.toFixed(2));
    }
    else {
      //return this.calculateStock(i,size,stock,operations);
      this.calculateStock(i, size, stock, operations);
    }
  }


}
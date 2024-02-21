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
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { ThisReceiver } from '@angular/compiler';

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
  items: any[] = []; // Suponiendo que los items son de tipo any

  tipodecambio:number=0;

  auxiliarResultadoPdf:number=0;
  tipoperiodo: { value: number; viewValue: string }[] = [
    { value: 15, viewValue: 'Quincenal' },
    { value: 30, viewValue: 'Mensual' },
    { value: 60, viewValue: 'Bimestral' },
    { value: 90, viewValue: 'Trimestral' },
    { value: 120, viewValue: 'Cuatrimestral' },
    { value: 180, viewValue: 'Semestral' },
    { value: 360, viewValue: 'Anual' },
    { value: 5, viewValue: 'Personalizado' },
  ];

  tipocapitalizacion: { value: number; viewValue: string }[] = [
    { value: 1, viewValue: 'None' },
    { value: 30, viewValue: 'Mensual' },
    { value: 15, viewValue: 'Quincenal' },
    { value: 60, viewValue: 'Bimestral' },
    { value: 90, viewValue: 'Trimestral' },
    { value: 120, viewValue: 'Cuatrimestral' },
    { value: 180, viewValue: 'Semestral' },
    { value: 360, viewValue: 'Anual' },
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
    this.auxiliarResultadoPdf=stock;
    if (i >= size) {

      this.uS.list().subscribe(
        (listaItems: any[]) => {
          this.items = listaItems;
          console.log(this.items);
        },
        error => {
          console.error('Error al obtener la lista de items:', error);
        }
      );


      if(this.tipodecambio=1)
      {
        this.resultado = "El monto total acumulado hasta el dia de hoy "+operations[i-1].fecha_operacion+" es de S/. "+parseFloat(stock.toFixed(2));
      }
      else{
        this.resultado = "El monto total acumulado hasta el dia de hoy "+operations[i-1].fecha_operacion+" es de $/. "+(parseFloat(stock.toFixed(2))/3.8);
      }
    }
    else {
      //return this.calculateStock(i,size,stock,operations);
      this.calculateStock(i, size, parseFloat(stock.toFixed(2)), operations);
    }
  }

  generarPDF()
  {

    const doc = new jsPDF()
    const fecha = new Date();
    this.datasource.paginator = null;
    const totalElementos = this.datasource.data.length;

    const datos = this.datasource.data;


    this.agregarContenidoPDF(doc, fecha, datos);


    doc.save('Reporte Financiero - '+this.username.toUpperCase()+'.pdf')

  }
  agregarContenidoPDF(doc:any, fecha:Date, datos:any) {
  const imgData = 'data:image/png;base64,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'; // Aquí debes poner la URL o los datos de la imagen
    doc.addImage(imgData, 'png', 180, 5, 15, 15);
    // Para colocar marca de agua
    //doc.addImage(imgData, 'png',  0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
    this.gettingAllOperations();
    doc.text("Reporte Total de la operación",15,12);
    doc.text("Usuario: "+this.username.toUpperCase(),15,30);
    doc.text("Fecha: "+fecha.toLocaleDateString(),15,37);

    doc.text("El resultado de la operación: "+parseFloat(this.auxiliarResultadoPdf.toFixed(2)).toString(),15,45);


    const columns = [
      { header: '#', dataKey: 'idx' },
      { header: 'Tipo de deposito', dataKey: 'tipo_deposito' },
      { header: 'Monto', dataKey: 'monto' },
      { header: 'Tipo de tasa', dataKey: 'tipo_tasa' },
      { header: 'Periodo', dataKey: 'periodo' },
      { header: 'Porcentaje de Tasa', dataKey: 'porcentaje_tasa' },
      { header: 'Capitalización', dataKey: 'capitalizacion' },
      { header: 'Fecha de Operación', dataKey: 'fecha_operacion' },
    ];


    autoTable(doc, {
      columns:columns,
      body:datos,
      startY:60,
    })

    this.datasource.paginator = this.paginator;

  }
}

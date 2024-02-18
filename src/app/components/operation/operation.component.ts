import { Component, OnInit, ViewChild } from '@angular/core';
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
import { DialogComponent } from './dialog/dialog.component';
import { UsersService } from 'src/app/services/users.service';

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
  constructor(private oS:OperationService){

  }
  ngOnInit(): void {
    this.oS.list().subscribe((data) => {
      this.datasource = new MatTableDataSource(data);
      this.datasource.paginator = this.paginator;
    });
    this.oS.getList().subscribe((data) => {//actualiza la lista si es actualizada o eliminada
      this.datasource = new MatTableDataSource(data);
      this.datasource.paginator = this.paginator;

    });


  }
  eliminar(id: number) {
    this.oS.delete(id).subscribe((data) => {
    this.oS.list().subscribe((data) => {
    this.oS.setList(data);
    });
    });
    }
  filter(en: any) {
  this.datasource.filter = en.target.value.trim();
  }
}

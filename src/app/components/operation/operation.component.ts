import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Operation } from 'src/app/models/operation';
import { OperationService } from 'src/app/services/operation.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.css']
})
export class OperationComponent implements OnInit {
  //Para el tab Ingreso
  selectedIngresoPeriodo = 'option0';
  selectedIngresoTasa = 'option0';
  //Para el tab Retiro
  selectedRetiroPeriodo = 'option0';
  selectedRetiroTasa= 'option0';
  //Para el tab Libre
  selectedLibrePeriodo = 'option0';
  selectedLibreTasa= 'option0';

  username:string;

  datasource: MatTableDataSource<Operation> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [
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
    'accion02',
  ];
  constructor(private oS:OperationService,private route:ActivatedRoute){
    this.username= String(sessionStorage.getItem("username"));
    console.log(this.username);
  }
  ngOnInit(): void {

    this.oS.listId(this.username).subscribe((data) => {
      this.datasource = new MatTableDataSource(data);
      this.datasource.paginator = this.paginator;
    });
    this.oS.getList().subscribe((data) => {
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

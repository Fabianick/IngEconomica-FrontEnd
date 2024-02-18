import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OperationService } from 'src/app/services/operation.service';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  @Output() aceptar: EventEmitter<void> = new EventEmitter<void>();


  constructor(
    private dialogRef: MatDialogRef<DialogComponent>) { }
    ngOnInit(): void {
    }

    cancelclick(){
      this.dialogRef.close();
    }

    aceptarClick(){
      this.aceptar.emit();
    this.dialogRef.close();
    }
}

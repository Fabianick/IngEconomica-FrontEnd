import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ToolbarMostrarComponent } from './toolbar-mostrar/toolbar-mostrar.component';
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit{
  constructor(public route:ActivatedRoute) { }
  ngOnInit(): void {}
}

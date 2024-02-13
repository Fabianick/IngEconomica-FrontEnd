import { Component , OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-indexa',
  templateUrl: './indexa.component.html',
  styleUrls: ['./indexa.component.css']
})
export class IndexaComponent implements OnInit{
  constructor(public route:ActivatedRoute) { }
  ngOnInit(): void {}
}

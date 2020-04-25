import { Component, OnInit, DoCheck } from '@angular/core';

declare var $: any;
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, DoCheck {
public title: string;
  constructor() {
    this.title ="Mensajería privada"
   }

  ngOnInit(): void {
    console.log("main.component cargado...")
  }
  ngDoCheck(): void {
  }
menu(){
  $('.ui.sidebar')
  .sidebar('toggle')
;
}
}
// https://stackoverrun.com/es/q/9112403

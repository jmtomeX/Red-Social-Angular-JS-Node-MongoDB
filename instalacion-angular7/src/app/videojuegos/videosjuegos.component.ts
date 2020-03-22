import {Component} from '@angular/core';
@Component ({
    selector: 'videosjuegos',
    templateUrl:'./viedeojuegos.component.html'
})

export class VideosjuegosComponent{
    public nombre:string;
    public tematica:string;
    public version:string;
    public show_version:boolean;
    public color:string;
    public year:number;

    public users_connect:Array<string>;

    constructor() {
      this.nombre = "Busco nombre para red social";
      this.tematica ='Temática deporte';
      this.version = "v 1.0";
      this.show_version = false;
      this.color = "olive";
      this.year = 2020;
      this.users_connect =  [
        'Peter',
        'Ariel', 
        'Sin Chan',
        'Lolita', 
        'Antonio'
    ];
    }
}
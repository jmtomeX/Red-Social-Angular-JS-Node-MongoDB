import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from './services/user.service';


declare var $: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[UserService]
})
export class AppComponent implements OnInit, DoCheck {
  public title1:string;
  public title2:string;
  public identity;

  constructor(
    private _userService: UserService,
  ){
    this.title1 = 'Coronavirus';
    this.title2 = 'Metting';
  }

  ngOnInit() {

    this.identity = this._userService.getIdentity();
    console.log(this.identity);


  // $('.dropdown')
  // .dropdown({
  //   action: 'combo'
  // });

  $('div').mouseover(function(){
    $(this).dropdown({
      action: 'combo'
    })
  });

  // $('div').click(function(){alert('Wass up!'); });


  }
  // cada vez que se realice un cambio se actualiza, ejecuta lo que hay dentro
  ngDoCheck() {
    this.identity = this._userService.getIdentity();
  }


}

import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from './services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from './services/global';
declare var $: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit, DoCheck {
  public title1: string;
  public title2: string;
  public identity;
  public url: string;
  public word: string;
  public withSearch: boolean;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.title1 = 'Coronavirus';
    this.title2 = 'Metting';
    this.url = GLOBAL.url;
    this.withSearch = false;
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    // $('.dropdown')
    // .dropdown({
    //   action: 'combo'
    // });

    $('div').mouseover(function () {
      $(this).dropdown({
        action: 'combo'
      })
    });
    // no funciona con la clase ni id
    // $('.dropdown').click(function(){alert('Wass up!'); });


  }
  // cada vez que se realice un cambio se actualiza, ejecuta lo que hay dentro
  ngDoCheck() {
    this.identity = this._userService.getIdentity();

  }

  logout() {
    localStorage.clear();
    this.identity = null;
    // redireccionar
    this._router.navigate(['/']);
  }

  onSubmit(searchForm, event) {
    this.withSearch = true;
    this._router.navigate(['/gente/' + this.word + '/' + this.withSearch]);
    searchForm.reset();
  }
}

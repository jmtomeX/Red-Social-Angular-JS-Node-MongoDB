import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';

declare var $: any;

@Component({
  selector: 'app-users',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  providers: [UserService]
})

export class TimelineComponent implements OnInit,DoCheck {
  public title: string;
  public token;
  public url: string;
  public identity;
  public publication: Publication;
  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router
    ) {
      this.title ="TimeLine"
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
      this.url = GLOBAL.url;
     }

  ngOnInit(): void {
  console.log("Timeline se ha cargado correctamente")
  }

  ngDoCheck(): void {
  }

}

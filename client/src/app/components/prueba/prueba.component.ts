import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.css'],
  providers: [UserService, FollowService]
})
export class PruebaComponent implements OnInit {
  public title: string;
  public token;
  public url: string;
  public identity;
  public stats;
  public conters;
  public page;
  public pages;
  public next_page;
  public prev_page;
  public total;
  public users: User[];
  public status: string;
  public follows;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _followService: FollowService
  ) {
    this.title = 'Listado de contagiados';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.stats = this._userService.getStats();
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    console.log(this.getUsers(1))
  }

  getUsers(page) {
    this._userService.getUsers(page).subscribe(
      response => {
        if (!response.users) {
          this.status = 'error';
        } else {
          this.total = response.total;
          this.users = response.users;
          this.pages = response.pages;
          this.follows = response.users_following;
          console.log(this.follows);
          if (page > this.pages) {
            // carga la página 1 de usuarios
            this._router.navigate(['/gente/', 1]);
          }
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage) {
          this.status = 'error';
        }
      }
    );
  }
}

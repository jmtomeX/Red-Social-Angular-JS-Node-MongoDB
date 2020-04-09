import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
declare var $: any;

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService, FollowService]
})
export class ProfileComponent implements OnInit {
  public title: string;
  public user: User;
  public token;
  public url: string;
  public identity;
  public status;
  public stats;
  public followed;
  public following;


  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _followService: FollowService

  ) {
    this.title = "Perfil"
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.followed;
    this.following;
  }

  ngOnInit(): void {
    console.log('Profile.component cargado correctamente');
    this.loadPage();

    $(function () {
      $('.segment').dimmer('show');
      // right button
      $('.segment').dimmer('hide');
    });
    // left button

  }

  loadPage() {
    // sacar los parámetros que llegan por la url
    this._route.params.subscribe(params => {
      let id = params['id'];
      this.getUser(id);
      this.getCounters(id);
    }
    )
  }

  getUser(id) {
    this._userService.getUser(id).subscribe(
      response => {
        if (response.user) {
          console.log(response)
          this.user = response.user;
          // si le sigo
          if (response.following != null) {
            this.following = true;
            console.log("Le sigo")
          } else {
            this.following = false;
            console.log("no le sigo")
          }
          // si soy seguido por otro
          if (response.followed != null) {
            this.followed = true;
          } else {
            this.followed = false;
          }
        } else {
          this.status = "error";
        }
      }, error => {
        console.log(<any>error);
        // si hay un error en la ruta nos lleva al pefil del usuario conectado
        this._router.navigate(['/perfil', this.identity._id]);
      }
    )
  }

  getCounters(id) {
    this._userService.getCounters(id).subscribe(
      response => {
        this.stats = response;
      }, error => {
        console.log(<any>error);

      }
    )
  }
}

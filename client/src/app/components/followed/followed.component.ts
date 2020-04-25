  import { Component, OnInit, DoCheck } from '@angular/core';
  import { Router, ActivatedRoute, Params } from '@angular/router';
  import { UserService } from '../../services/user.service';
  import { FollowService } from '../../services/follow.service';
  import { GLOBAL } from '../../services/global';
  import { User } from '../../models/user';
  import { Follow } from '../../models/follow';
  declare var $: any;
  @Component({
    selector: 'followed',
    templateUrl: './followed.component.html',
    styleUrls: ['./followed.component.css'],
    providers: [UserService, FollowService]
  })
  export class FollowedComponent implements OnInit, DoCheck {
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
    public followed;
    public user_page_id;
    constructor(
      private _route: ActivatedRoute,
      private _router: Router,
      private _userService: UserService,
      private _followService: FollowService
    ) {
      this.title = 'Seguidores de ';
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
      this.stats = this._userService.getStats();
      this.url = GLOBAL.url;
    }


    ngOnInit(): void {
      console.log("following.component ha sido cargado.");
      this.actualPage();
    }
    ngDoCheck() {
      $('.special.cards .image').dimmer({
        on: 'hover'
      });
      this.stats = this._userService.getStats();

    }


    // recoger la página en la que estamos
    actualPage() {
      this._route.params.subscribe(params => {
        let user_id = params['id'];
        // lo convertimos a entero
        let page = +params['page'];

        this.page = page;
        console.log(params)
        this.user_page_id = user_id;

        if (!params['page']) {
          page = 1;
        }

        if (!page) {
          page = 1;
        } else {
          this.next_page = page + 1;
          this.prev_page = page - 1;
          if (this.prev_page <= 0) {
            this.prev_page = 1;
          }
        }
        // devolver el usuario seguidor con el listado de seguidos
        this.getUser(user_id,page)

      });
    }

    getFollows(user_id, page) {
      this._followService.getFollowed(this.token, user_id, page).subscribe(
        response => {
          if (!response.follows) {
            this.status = 'error';
          } else {
            this.total = response.total;
            this.followed = response.follows;
            this.pages = response.pages;
            this.follows = response.users_followed;
            console.log(response);
            if (page > this.pages) {
              // carga la página 1 de usuarios
              this._router.navigate(['/seguidores/', this.user_page_id, 1]);
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

    public user: User;
    // nombre del usuario seguidor
    getUser(user_id, page) {
      // el token no se le pasa porque lo coge del propio servicio
      this._userService.getUser(user_id).subscribe(
        response => {
          if (response.user) {
            this.user = response.user;

            // devolver listado de usuarios.
            this.getFollows(user_id, page);
          } else {
            this._router.navigate(['/home']);
          }
        },
        error => {
          var errorMessage = <any>error;
          console.log(errorMessage);
          if (errorMessage) {
            this.status = 'error';
          }
        }
      )
    }

    public followUserOverEd;
    mouseEnter(user_id) {
      this.followUserOverEd = user_id;
    }
    mouseLeave(user_id) {
      //para que no marque ningún botón
      this.followUserOverEd = 0;
      console.log("mouseLeave "  + this.followUserOverEd);
    }

    followUser(followed) {
      var follow = new Follow('', this.identity._id, followed);
      this._followService.addFollow(this.token, follow).subscribe(
        response => {
          if (!response.follow) {
            this.status = 'error';
          } else {
            this.status = 'succes';
            this.follows.push(followed);
          }
        },
        error => {
          var errorMessage = <any>error;
          console.log(errorMessage);
          if (errorMessage) {
            this.status = 'error';
          }

        }
      )
    }

    unfollowUser(followed) {
      this._followService.deleteFollow(this.token, followed).subscribe(
        response => {
          // buscar en el array
          var search = this.follows.indexOf(followed);
          // eliminarlo del array
          if (search != -1) {
            this.follows.splice(search, 1)
          }
          this._userService.getStats();
          //this._router.navigate(['/seguidores/', this.user_page_id, this.page]);
        },
        error => {
          var errorMessage = <any>error;
          console.log(errorMessage);
          if (errorMessage) {
            this.status = 'error';
          } else { }
          this.status = 'succes';
          this.follows.push(followed);
        }
      )
    }

  }

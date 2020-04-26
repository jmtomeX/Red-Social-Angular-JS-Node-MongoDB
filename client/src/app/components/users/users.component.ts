import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';
import { User } from '../../models/user';
import { Follow } from '../../models/follow';
declare var $: any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UserService, FollowService]
})
export class UsersComponent implements OnInit, DoCheck {
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
  public word;
  public show: boolean;


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
    this.show = false;
  }

  ngOnInit(): void {
    console.log("Users.component ha sido cargado.");
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
      // lo convertimos a entero
      let page = +params['page'];
      this.page = page;
      // recoger usuarios buscados en el menu search
      if (params['search']) {
        let word;
        word = params['word'];
        this.title = 'Busqueda de usuarios relacionados con ' + word;
        let use = this.searchUsers(word);

        // usuarios totales páginados
      } else {
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
      // devolver listado de usuarios totales.
      this.getUsers(page);
      }
    });
  }


  searchUsers(word) {
    this._userService.searchUser(word).subscribe(
      response => {
        if (response.users) {
          this.users = response.users;
          console.log("searchUsers " + this.users)
          this.status = response.status;
          if(this.status == "succes"){
            this.show = true;
          }
        }
      }, error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage) {
          this.status = 'error';
        }
      }
    )
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

  public followUserOver;
  mouseEnter(user_id) {
    this.followUserOver = user_id;
  }
  mouseLeave(user_id) {
    //para que no marque ningún botón
    this.followUserOver = 0;
  }

  followUSer(followed) {
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

  unfollowUSer(followed) {
    this._followService.deleteFollow(this.token, followed).subscribe(
      response => {
        // buscar en el array
        var search = this.follows.indexOf(followed);
        // eliminarlo del array
        if (search != -1) {
          this.follows.splice(search, 1)
        }
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

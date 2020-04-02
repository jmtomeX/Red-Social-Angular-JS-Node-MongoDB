import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import {User } from '../../models/user';
declare var $: any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UserService]
})
export class UsersComponent implements OnInit {
  public title: string;
  public token;
  public url: string;
  public identity;
  public page;
  public pages;
  public next_page;
  public prev_page;
  public total;
  public users: User[];
  public status: string;


  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
  ) {
    this.title = 'Usuarios';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    console.log("USers.component ha sido cargado.");

    this.actualPage();

    $('.special.cards .image').dimmer({
      on: 'hover'
    });
  }

  // recoger la página en la que estamos
  actualPage() {
    this._route.params.subscribe(params => {
      // lo convertimos a entero, se puede convertir poniendole delante +params['page']
      let page = parseInt(params['page']);
      this.page = page;
      if (!page) {
        page = 1;
      } else {
        this.next_page = page + 1;
        this.prev_page = page - 1;
        if (this.prev_page <= 0) {
          this.prev_page = 1;
        }
      }
      // devolver listado de usuarios.
      this.getUsers(page);
    });
  }

  getUsers(page) {
    this._userService.getUsers(page).subscribe(
      response => {
        if(!response.users){
          this.status = 'error';
        }else {
         this.total = response.total;
         this.users = response.users;
         this.pages = response.pages;
         if(page > this.pages){
           // carga la página 1 de usuarios
           this._router.navigate(['/usuarios',1]);
         }
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage){
          this.status = 'error';
        }
      }
    );
  }
}

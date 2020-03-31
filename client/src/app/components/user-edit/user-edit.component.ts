import { Component, OnInit } from '@angular/core';
//import { Routes, RouterModule, Params } from '@angular/router';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService]
})
export class UserEditComponent implements OnInit {
  public title: string;
  public user: User;
  public identity;
  public token;
  public status: string;
  constructor(
    private _route:ActivatedRoute,
    private _router: Router,
    private _userService:UserService
  ) {
    this.title = 'Actualizar mis datos';
    this.user = this._userService.getIdentity();
    this.identity = this.user;
    this.token = this._userService.getToken();
   }

  ngOnInit(): void {
    console.log("edit-user se ha cargado");
    console.log(this.user);
  }

  onSubmit(){
    this._userService.updateUser(this.user).subscribe(
      response => {
        if(!response.user){
          this.status = 'error';
        } else {
          this.status = 'succes';
          localStorage.setItem('identity', JSON.stringify(this.user));
          this.identity = this.user;

          // subida de imagen de usuario
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage != null){
          this.status = 'error';
        }
      }
    )
  }

  ngDoCheck() {
    this.identity = this.user;
  }

}

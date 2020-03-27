import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public title: string;
  public user: User;
  public status: string;
  public token;
  public identity;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
  ) {
    this.title = 'Login';
    this.user = new User("", "", "", "", "", "", "ROLE_USER", "");
  }

  ngOnInit(): void {
    console.log('Componente login cargado....')
  }

  onSubmit() {
    // loguear al usuario y conseguir los sus datos
    this._userService.signup(this.user).subscribe(
      response => {
        console.log("Desde la res " + this.user + "respuesta " + response.user);
        this.identity = response.user;
        if(!this.identity || !this.identity._id){
          this.status = 'error'
        }
        this.status = 'succes';
        // persistir datos del usuario.

        //recoger el token
        this.getToken();

      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage != null) {
          this.status = 'error';
        }
      }
    );
  }

  getToken() {
    // le pasamos el valor true para el token
    this._userService.signup(this.user, 'true').subscribe(
      response => {
        console.log("Desde la res " + this.user + "respuesta " + response.user);
        this.token = response.token;
        console.log(this.token);
        console.log(this.identity);
        if(this.token.length <= 0){
          this.status = 'error'
        }
        this.status = 'succes';
        // persistir token del usuario.

        //recoger contadores o estadisticas del usuario

      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage != null) {
          this.status = 'error';
        }
      }
    );
  }

}

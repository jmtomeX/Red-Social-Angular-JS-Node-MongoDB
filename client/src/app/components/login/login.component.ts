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
    this.user = new User("", "", "", "", "","", "", "ROLE_USER", "");
  }

  ngOnInit(): void {
    console.log('Componente login cargado....')
  }

  onSubmit() {
    // loguear al usuario y conseguir los sus datos
    this._userService.signup(this.user).subscribe(
      response => {
        this.identity = response.user;
        if (!this.identity || !this.identity._id) {
          this.status = 'error'
        }
        // persistir datos del usuario.
        localStorage.setItem('identity', JSON.stringify(this.identity));
        //recoger el token
        this.getToken();
        console.log(this.getToken)
        // Recoger contadores o estadisticas del usuario

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
        this.token = response.token;
        console.log(this.token);
        console.log(this.identity);
        if (this.token.length <= 0) {
          this.status = 'error'
        }

        // persistir token del usuario.
        // localStorage no guardo objetos por lo que hay que pasarlo a json
        localStorage.setItem('token', this.token);
        //recoger contadores o estadisticas del usuario
        this.getCounters();
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

  getCounters() {
    this._userService.getCounters().subscribe(
      response => {
        console.log(response);
        localStorage.setItem('stats', JSON.stringify(response));
        this.status = 'succes';
        this._router.navigate(['/']);
      },
      error => {
        console.log("Error desde login.component getCounter " + <any>error);
      }

    )
  }
}

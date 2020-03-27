import { Component, OnInit } from '@angular/core';
//import { Routes, RouterModule, Params } from '@angular/router';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})

export class RegisterComponent implements OnInit {
  public title: string;
  public user: User;
  public status: string;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
  ) {
    this.title = 'Registrate';
    this.user = new User("", "", "", "", "", "", "ROLE_USER", "");
  }

  ngOnInit(): void {
    console.log('Componente register cargado....');
  }

  onSubmit(registerForm) {
    this._userService.register(this.user).subscribe(
      response => {
        this.user = response;
        console.log("Desde la res " + this.user + "respuesta " + response);
        // si llega la propiedad user y esa propieda tiene un _id
        if (response.user && response.user._id) {
          console.log(response.user);
          this.status = 'succes';
          registerForm.reset();
        } else {
          this.status = 'error';

        }
      },
      error => {
        console.log(<any>error);
      }
    );

    //this._userService.register(this.user).subscribe(
    //   (val) => {
    //     console.log("POST llamada valor exitosa devuelta en el cuerpo",
    //                 val);
    // },
    //   response => {
    //     this.user = response;
    //     console.log("Desde la res " + this.user + "respuesta " + response);
    //     // si llega la propiedad user y esa propieda tiene un _id
    //     if(response.user && response.user._id) {
    //       console.log(response.user);
    //       this.status = 'succes';
    //     }
    //   },
    //   () => {
    //     console.log("El POST observable ahora se ha completado.");
    //   }
    // );

  }

}

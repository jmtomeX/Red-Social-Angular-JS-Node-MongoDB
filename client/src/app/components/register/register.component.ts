import { Component, OnInit, DoCheck, NgModule } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})


export class RegisterComponent implements OnInit, DoCheck {
  public title: string;
  public user: User;
  public status: string;
  public checked: boolean;

public contact = { name: '', isVIP: false, gender: '' };

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
  ) {
    this.title = 'Registrate';
    this.user = new User("", "", "", "", "", "", "", "ROLE_USER", "");
  }

  ngOnInit(): void {
    console.log('Componente register cargado....');
  }

  ngDoCheck() {
    $('.ui.checkbox')
      .checkbox({
        onChecked: function () {
          this.checked = true;
          console.log(this.checked);
        }
      })
      console.log(this.checked);
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


  }
  // validate(control: AbstractControl) {
  // }

}

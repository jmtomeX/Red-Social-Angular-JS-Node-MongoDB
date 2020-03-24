import { Component, OnInit } from '@angular/core';
//import { Routes, RouterModule, Params } from '@angular/router';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})

export class RegisterComponent implements OnInit {
    public title:string;
    public user: User;
      constructor(
        private _route:  ActivatedRoute,
        private _router: Router

      ) {
        this.title = 'Registrate';
        this.user = new User("","","","","","","","ROLE_USER","");
      }

      ngOnInit(): void {
        console.log('Componente login cargado....');
      }

       onSubmit(user) {

      }

    }

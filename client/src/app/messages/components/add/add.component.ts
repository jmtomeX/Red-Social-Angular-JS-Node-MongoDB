import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { FollowService } from '../../../services/follow.service';
import { MessageService } from '../../../services/message.service';
import { UserService } from '../../../services/user.service';
import { GLOBAL } from '../../../services/global';
import { Follow } from '../../../models/follow';
import { Message } from '../../../models/message';
import { convertActionBinding } from '@angular/compiler/src/compiler_util/expression_converter';
declare var $: any;
@Component({
  selector: 'add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  providers: [MessageService, FollowService, UserService]
})
export class AddComponent implements OnInit, DoCheck {
  public title: string;
  public message: Message;
  public identity;
  public url: string;
  public token;
  public status;
  // array de usuarios para mandarles mensajes.
  public follows;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _messageService: MessageService,
    private _followService: FollowService,
    private _userService: UserService
  ) {
    this.title = 'Enviar Mensaje ';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.message = new Message('', '', '', '', this.identity._id, false);
  }
  // public _id: string,
  // public emitter:string,
  // public receiver: string,
  // public text: string,
  // public created_at: string,
  // public viewed: boolean
  ngOnInit(): void {
    console.log("add.component cargado...");
    this.follows = this.getMyFollows();
    $(function () {
      $('select.dropdown').dropdown();
      ;
    });
    console.log(this.follows);
  }
  ngDoCheck(): void {
  }

  onSubmit() {

  }
  getMyFollows() {
    this._followService.getMyFollows(this.token).subscribe(
      response => {
        this.follows = response.follows;
      },
      error => {
        console.log(<any>error);
      }
    )
  }
}

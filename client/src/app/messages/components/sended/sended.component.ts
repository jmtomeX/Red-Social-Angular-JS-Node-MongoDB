import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { MessageService } from '../../../services/message.service';
import { UserService } from '../../../services/user.service';
import { GLOBAL } from '../../../services/global';
import { Message } from '../../../models/message';
import { User } from '../../../models/user';

import { trimTrailingNulls } from '@angular/compiler/src/render3/view/util';
declare var $: any;

@Component({
  selector: 'app-sended',
  templateUrl: './sended.component.html',
  styleUrls: ['./sended.component.css'],
  providers: [MessageService, UserService]
})
export class SendedComponent implements OnInit {
  public title: string;
  public message: Message;
  public identity;
  public url: string;
  public token;
  public status;
  public next_page;
  public prev_page;
  public page;
  public pages;
  public total;
  public messages:Message[];
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _messageService: MessageService,
    private _userService: UserService
  ) {
    this.title = "Mensajes enviados";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    console.log("sended.component cargado...");
    this.actualPage();
  }

  getMessages(token,page){
    this._messageService.getEmmitMessages(token,this.page).subscribe(
      response => {
       if(!response.messages){
      } else {
        this.messages = response.messages;
        console.log(this.messages);
        this.total = response.total;
        this.pages = response.pages;
       }
      },
      error => {
        console.log(<any>error);
      }
    )
  }

    // recoger la página en la que estamos
    actualPage() {
      this._route.params.subscribe(params => {
        // lo convertimos a entero
        let page = +params['page'];
        this.page = page;

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
        // devolver listado de mensajes.
        this.getMessages(this.token,page);
      });
    }
}
